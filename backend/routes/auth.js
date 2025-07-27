import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import sendEmail from '../utils/sendEmail.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail({ gmail_remove_dots: false }).withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, password, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('email').notEmpty().withMessage('Email or phone is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    let user;
    if (email.includes('@')) {
      // Login with email
      user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      console.log('Login attempt for email:', email);
    } else {
      // Login with phone
      const cleanPhone = email.replace(/\D/g, '');
      user = await User.findOne({ phone: cleanPhone }).select('+password');
      console.log('Login attempt for phone:', cleanPhone);
    }

    if (!user) {
      console.log('User not found for login:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    console.log('Password match result:', isMatch);
    if (!isMatch) {
      console.log('Password does not match for user:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);
    console.log('Login successful for user:', user.email || user.phone);
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').optional().notEmpty().withMessage('Phone number cannot be empty')
], async (req, res) => {
  try {
    console.log('[PROFILE UPDATE] req.body:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, phone, address } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    console.log('[PROFILE UPDATE] user before:', user);

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();
    console.log('[PROFILE UPDATE] user after:', user);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('[PROFILE UPDATE ERROR]', error.stack || error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', protect, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    console.log('[CHANGE PASSWORD] req.body:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    console.log('[CHANGE PASSWORD] user before:', user);

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    console.log('[CHANGE PASSWORD] isMatch:', isMatch);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();
    console.log('[CHANGE PASSWORD] user after:', user);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('[CHANGE PASSWORD ERROR]', error.stack || error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Generate a random new password
    const newPassword = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);
    console.log('Generated new password:', newPassword);

    // Update the password
    user.password = newPassword;
    await user.save();
    console.log('Password saved to database');

    // Check if email configuration is available
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.log('Email not configured, returning password in response');
      return res.json({ 
        success: true, 
        message: 'Password reset successful. Please check your email or contact support.',
        tempPassword: newPassword // Only for development/testing
      });
    }

    // Send email with new password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `Gym Brand <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: 'Your Gym Brand Password Reset',
      text: `Your new password is: ${newPassword}\n\nPlease log in and change it immediately.`,
    });

    console.log('Email sent successfully');
    res.json({ success: true, message: 'A new password has been sent to your email.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    
    // If email fails but password was updated, return success with temp password
    if (err.code === 'EAUTH' || err.code === 'ECONNECTION') {
      return res.json({ 
        success: true, 
        message: 'Password reset successful. Please check your email or contact support.',
        tempPassword: newPassword // Only for development/testing
      });
    }
    
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Send email verification code
// @route   POST /api/auth/send-email-verification
// @access  Private
router.post('/send-email-verification', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified' });
    }
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailVerificationCode = code;
    user.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();
    // Log state after save
    console.log('[SEND EMAIL VERIFICATION] user:', user._id, 'email:', user.email, 'code:', user.emailVerificationCode, 'expires:', user.emailVerificationExpires);
    // Send email using Mailgun
    const emailResult = await sendEmail({
      to: user.email,
      subject: 'SCARS Email Verification Code',
      text: `Your SCARS email verification code is: ${code}.\nValid for 10 minutes. If you did not request this, ignore this email.`,
      html: `<p>Your SCARS email verification code is: <b>${code}</b>.<br>Valid for 10 minutes. If you did not request this, ignore this email.</p>`
    });
    
    if (!emailResult.success) {
      console.warn('Email service not available, but continuing with verification code generation');
      // Still allow the process to continue even if email fails
    }
    
    res.json({ success: true, message: 'Verification email sent' });
  } catch (error) {
    console.error('[SEND EMAIL VERIFICATION ERROR]', error.stack || error);
    res.status(500).json({ success: false, message: 'Failed to send verification email', error: error.message });
  }
});

// @desc    Verify email with code
// @route   POST /api/auth/verify-email
// @access  Private
router.post('/verify-email', protect, [
  body('code').isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified' });
    }
    if (!user.emailVerificationCode || !user.emailVerificationExpires) {
      return res.status(400).json({ success: false, message: 'No verification code found. Please request a new one.' });
    }
    if (user.emailVerificationExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'Verification code expired. Please request a new one.' });
    }
    if (req.body.code !== user.emailVerificationCode) {
      return res.status(400).json({ success: false, message: 'Invalid verification code' });
    }
    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify email' });
  }
});

// @desc    Request email change (send code to new email)
// @route   POST /api/auth/request-email-change
// @access  Private
router.post('/request-email-change', protect, [
  body('newEmail').isEmail().normalizeEmail({ gmail_remove_dots: false }).withMessage('Please provide a valid email'),
], async (req, res) => {
  try {
    const { newEmail } = req.body;
    // Check if email already exists
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }
    // Generate code and store in user temp fields
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.findById(req.user.id);
    user.tempEmail = newEmail;
    user.tempEmailCode = code;
    user.tempEmailCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    // Fetch user again to confirm fields are saved
    const userCheck = await User.findById(req.user.id);
    console.log('[EMAIL CHANGE REQUEST] user:', userCheck);
    if (!userCheck.tempEmail || !userCheck.tempEmailCode) {
      console.warn('[EMAIL CHANGE REQUEST] WARNING: temp fields not saved! user:', userCheck);
      return res.status(500).json({ success: false, message: 'Failed to save email change request. Please try again.' });
    }
    // Send code to new email
    const emailResult = await sendEmail({
      to: newEmail,
      subject: 'SCARS Email Change Verification Code',
      text: `Your code to change email is: ${code}.\nValid for 10 minutes.`,
      html: `<p>Your code to change email is: <b>${code}</b>.<br>Valid for 10 minutes.</p>`
    });
    
    if (!emailResult.success) {
      console.warn('Email service not available, but continuing with email change request');
      // Still allow the process to continue even if email fails
    }
    
    res.json({ success: true, message: 'Verification code sent to new email' });
  } catch (error) {
    console.error('[REQUEST EMAIL CHANGE ERROR]', error.stack || error, 'user:', req.user?.id, 'body:', req.body);
    res.status(500).json({ success: false, message: 'Failed to send verification code', error: error.message });
  }
});

// @desc    Confirm email change
// @route   POST /api/auth/confirm-email-change
// @access  Private
router.post('/confirm-email-change', protect, [
  body('code').isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits'),
], async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user.id);
    console.log('[EMAIL CHANGE CONFIRM] user:', user._id, 'tempEmail:', user.tempEmail, 'tempEmailCode:', user.tempEmailCode, 'expires:', user.tempEmailCodeExpires);
    if (!user.tempEmail || !user.tempEmailCode || !user.tempEmailCodeExpires) {
      console.warn('[EMAIL CHANGE CONFIRM] WARNING: temp fields missing!');
      return res.status(400).json({ success: false, message: 'No email change requested' });
    }
    if (user.tempEmailCodeExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'Verification code expired' });
    }
    if (code !== user.tempEmailCode) {
      return res.status(400).json({ success: false, message: 'Invalid verification code' });
    }
    // Update email
    user.email = user.tempEmail;
    user.isEmailVerified = true;
    user.tempEmail = undefined;
    user.tempEmailCode = undefined;
    user.tempEmailCodeExpires = undefined;
    await user.save();
    // Log after update
    const userAfter = await User.findById(req.user.id);
    console.log('[EMAIL CHANGE CONFIRM AFTER] user:', userAfter._id, 'email:', userAfter.email, 'isEmailVerified:', userAfter.isEmailVerified);
    res.json({ success: true, message: 'Email updated successfully', email: user.email });
  } catch (error) {
    console.error('[CONFIRM EMAIL CHANGE ERROR]', error.stack || error, 'user:', req.user?.id, 'body:', req.body);
    res.status(500).json({ success: false, message: 'Failed to update email', error: error.message });
  }
});

// @desc    Request phone change (send OTP to new phone)
// @route   POST /api/auth/request-phone-change
// @access  Private
router.post('/request-phone-change', protect, [
  body('newPhone').notEmpty().withMessage('Phone number is required'),
], async (req, res) => {
  try {
    const { newPhone } = req.body;
    // Check if phone already exists
    const existingUser = await User.findOne({ phone: newPhone });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Phone number already in use' });
    }
    // Generate OTP and store in user temp fields
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.findById(req.user.id);
    user.tempPhone = newPhone;
    user.tempPhoneOTP = otp;
    user.tempPhoneOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    // Fetch user again to confirm fields are saved
    const userCheck = await User.findById(req.user.id);
    console.log('[PHONE CHANGE REQUEST] user:', userCheck);
    if (!userCheck.tempPhone || !userCheck.tempPhoneOTP) {
      console.warn('[PHONE CHANGE REQUEST] WARNING: temp fields not saved! user:', userCheck);
      return res.status(500).json({ success: false, message: 'Failed to save phone change request. Please try again.' });
    }
    // Send OTP using SMS service
    const smsService = req.app.get('smsService');
    if (smsService && smsService.isConfigured()) {
      await smsService.sendPhoneVerificationOTP(newPhone, otp);
    }
    res.json({ success: true, message: 'OTP sent to new phone' });
  } catch (error) {
    console.error('[REQUEST PHONE CHANGE ERROR]', error.stack || error, 'user:', req.user?.id, 'body:', req.body);
    res.status(500).json({ success: false, message: 'Failed to send OTP', error: error.message });
  }
});

// @desc    Confirm phone change
// @route   POST /api/auth/confirm-phone-change
// @access  Private
router.post('/confirm-phone-change', protect, [
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
], async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user.id);
    if (!user.tempPhone || !user.tempPhoneOTP || !user.tempPhoneOTPExpires) {
      return res.status(400).json({ success: false, message: 'No phone change requested' });
    }
    if (user.tempPhoneOTPExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }
    if (otp !== user.tempPhoneOTP) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    // Update phone
    user.phone = user.tempPhone;
    user.isPhoneVerified = true;
    user.tempPhone = undefined;
    user.tempPhoneOTP = undefined;
    user.tempPhoneOTPExpires = undefined;
    await user.save();
    res.json({ success: true, message: 'Phone updated successfully', phone: user.phone });
  } catch (error) {
    console.error('[CONFIRM PHONE CHANGE ERROR]', error.stack || error, 'user:', req.user?.id, 'body:', req.body);
    res.status(500).json({ success: false, message: 'Failed to update phone', error: error.message });
  }
});

// Test endpoint removed for production

export default router; 