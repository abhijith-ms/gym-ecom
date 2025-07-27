import express from 'express';
import { body, validationResult } from 'express-validator';
import TwilioSMSService from '../services/twilioSmsService.js';
import OTP from '../models/OTP.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Initialize SMS service with better error handling
let smsService;
try {
  smsService = new TwilioSMSService();
  console.log('SMS Service initialized:', smsService.isConfigured() ? 'Successfully' : 'Failed - missing credentials');
} catch (error) {
  console.error('Failed to initialize SMS service:', error.message);
  smsService = null;
}

// Middleware to check if SMS service is available
const checkSmsService = (req, res, next) => {
  if (!smsService || !smsService.isConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'SMS service is not configured. Please contact support or try again later.',
      error: 'SMS_SERVICE_NOT_CONFIGURED',
      code: 'SMS_NOT_AVAILABLE'
    });
  }
  next();
};

// @desc    Send OTP for phone verification
// @route   POST /api/sms/send-otp
// @access  Public (for signup) / Private (for profile update)
router.post('/send-otp', [
  body('phoneNumber')
    .notEmpty()
    .withMessage('Phone number is required')
    .custom((value) => {
      if (!smsService || !smsService.isConfigured()) {
        // If SMS service is not available, just validate the format
        const cleanNumber = value.replace(/[^\d]/g, '');
        if (cleanNumber.length === 10 && cleanNumber.match(/^[6-9]/)) {
          return true;
        }
        throw new Error('Please provide a valid Indian mobile number');
      }
      const cleanNumber = smsService.validatePhoneNumber(value);
      if (!cleanNumber) {
        throw new Error('Please provide a valid Indian mobile number');
      }
      return true;
    }),
  body('purpose')
    .optional()
    .isIn(['phone_verification', 'login'])
    .withMessage('Invalid purpose')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { phoneNumber, purpose = 'phone_verification' } = req.body;
    
    // Handle case when SMS service is not available
    if (!smsService || !smsService.isConfigured()) {
      const cleanPhoneNumber = phoneNumber.replace(/[^\d]/g, '');
      
      // Check if phone number is already verified (for existing users)
      if (purpose === 'phone_verification') {
        const existingUser = await User.findOne({ 
          phone: cleanPhoneNumber, 
          isPhoneVerified: true 
        });
        
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'Phone number is already verified'
          });
        }
      }

      // For development/testing: auto-verify phone when SMS service is not available
      const testOTP = '123456'; // Fixed test OTP
      
      // Save test OTP to database
      const otpRecord = new OTP({
        phoneNumber: cleanPhoneNumber,
        otp: testOTP,
        purpose,
        userId: req.user?.id || null
      });

      await otpRecord.save();

      return res.status(200).json({
        success: true,
        message: 'SMS service not configured. Using test OTP: 123456',
        data: {
          phoneNumber: cleanPhoneNumber,
          messageId: 'test-message-id',
          expiresIn: '10 minutes',
          testMode: true,
          testOTP: '123456'
        }
      });
    }

    // Normal SMS service flow
    const cleanPhoneNumber = smsService.validatePhoneNumber(phoneNumber);

    // Check if phone number is already verified (for existing users)
    if (purpose === 'phone_verification') {
      const existingUser = await User.findOne({ 
        phone: cleanPhoneNumber, 
        isPhoneVerified: true 
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is already verified'
        });
      }
    }

    // Check for recent OTP requests (rate limiting)
    const recentOTP = await OTP.findOne({
      phoneNumber: cleanPhoneNumber,
      createdAt: { $gte: new Date(Date.now() - 60000) } // Last 1 minute
    });

    if (recentOTP) {
      return res.status(429).json({
        success: false,
        message: 'Please wait before requesting another OTP'
      });
    }

    // Generate and send OTP
    const otp = smsService.generateOTP();
    const smsResult = await smsService.sendPhoneVerificationOTP(cleanPhoneNumber, otp);

    if (!smsResult.success) {
      return res.status(500).json({
        success: false,
        message: smsResult.error || 'Failed to send OTP'
      });
    }

    // Save OTP to database
    const otpRecord = new OTP({
      phoneNumber: cleanPhoneNumber,
      otp,
      purpose,
      userId: req.user?.id || null
    });

    await otpRecord.save();

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        phoneNumber: cleanPhoneNumber,
        messageId: smsResult.messageId,
        expiresIn: '10 minutes'
      }
    });

  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending OTP'
    });
  }
});

// @desc    Verify OTP
// @route   POST /api/sms/verify-otp
// @access  Public (for signup) / Private (for profile update)
router.post('/verify-otp', [
  body('phoneNumber')
    .notEmpty()
    .withMessage('Phone number is required'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { phoneNumber, otp } = req.body;
    const cleanPhoneNumber = smsService.validatePhoneNumber(phoneNumber);

    if (!cleanPhoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }

    // Find the most recent OTP for this phone number
    const otpRecord = await OTP.findOne({
      phoneNumber: cleanPhoneNumber,
      verified: false
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found for this phone number'
      });
    }

    // Verify OTP
    const verificationResult = otpRecord.verify(otp);
    await otpRecord.save();

    if (!verificationResult.success) {
      return res.status(400).json({
        success: false,
        message: verificationResult.message
      });
    }

    // Update user's phone verification status if user exists
    // Try to update by userId if present, otherwise by phone number
    if (otpRecord.userId) {
      await User.findByIdAndUpdate(otpRecord.userId, {
        isPhoneVerified: true,
        phoneVerifiedAt: new Date()
      });
    } else {
      // Fallback: update any user with this phone number
      await User.updateOne({ phone: cleanPhoneNumber }, {
        isPhoneVerified: true,
        phoneVerifiedAt: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Phone number verified successfully',
      data: {
        phoneNumber: cleanPhoneNumber,
        verifiedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying OTP'
    });
  }
});

// @desc    Resend OTP
// @route   POST /api/sms/resend-otp
// @access  Public
router.post('/resend-otp', [
  body('phoneNumber')
    .notEmpty()
    .withMessage('Phone number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { phoneNumber } = req.body;
    
    // Handle case when SMS service is not available
    if (!smsService || !smsService.isConfigured()) {
      const cleanPhoneNumber = phoneNumber.replace(/[^\d]/g, '');
      
      // Check for recent OTP requests (rate limiting - 2 minutes for resend)
      const recentOTP = await OTP.findOne({
        phoneNumber: cleanPhoneNumber,
        createdAt: { $gte: new Date(Date.now() - 120000) } // Last 2 minutes
      });

      if (recentOTP) {
        return res.status(429).json({
          success: false,
          message: 'Please wait 2 minutes before resending OTP'
        });
      }

      // For development/testing: auto-verify phone when SMS service is not available
      const testOTP = '123456'; // Fixed test OTP
      
      // Save new test OTP to database
      const otpRecord = new OTP({
        phoneNumber: cleanPhoneNumber,
        otp: testOTP,
        purpose: 'phone_verification'
      });

      await otpRecord.save();

      return res.status(200).json({
        success: true,
        message: 'SMS service not configured. Using test OTP: 123456',
        data: {
          phoneNumber: cleanPhoneNumber,
          messageId: 'test-message-id',
          expiresIn: '10 minutes',
          testMode: true,
          testOTP: '123456'
        }
      });
    }

    // Normal SMS service flow
    const cleanPhoneNumber = smsService.validatePhoneNumber(phoneNumber);

    if (!cleanPhoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }

    // Check for recent OTP requests (rate limiting - 2 minutes for resend)
    const recentOTP = await OTP.findOne({
      phoneNumber: cleanPhoneNumber,
      createdAt: { $gte: new Date(Date.now() - 120000) } // Last 2 minutes
    });

    if (recentOTP) {
      return res.status(429).json({
        success: false,
        message: 'Please wait 2 minutes before resending OTP'
      });
    }

    // Generate and send new OTP
    const otp = smsService.generateOTP();
    const smsResult = await smsService.sendPhoneVerificationOTP(cleanPhoneNumber, otp);

    if (!smsResult.success) {
      return res.status(500).json({
        success: false,
        message: smsResult.error || 'Failed to resend OTP'
      });
    }

    // Save new OTP to database
    const otpRecord = new OTP({
      phoneNumber: cleanPhoneNumber,
      otp,
      purpose: 'phone_verification'
    });

    await otpRecord.save();

    res.status(200).json({
      success: true,
      message: 'OTP resent successfully',
      data: {
        phoneNumber: cleanPhoneNumber,
        messageId: smsResult.messageId,
        expiresIn: '10 minutes'
      }
    });

  } catch (error) {
    console.error('Resend OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resending OTP'
    });
  }
});

// @desc    Send order confirmation SMS (Internal use)
// @route   POST /api/sms/order-confirmation
// @access  Private (Admin/System)
router.post('/order-confirmation', [
  checkSmsService,
  protect,
  body('phoneNumber')
    .notEmpty()
    .withMessage('Phone number is required'),
  body('orderDetails')
    .notEmpty()
    .withMessage('Order details are required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { phoneNumber, orderDetails } = req.body;
    const cleanPhoneNumber = smsService.validatePhoneNumber(phoneNumber);

    if (!cleanPhoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }

    const smsResult = await smsService.sendOrderConfirmation(cleanPhoneNumber, orderDetails);

    if (!smsResult.success) {
      return res.status(500).json({
        success: false,
        message: smsResult.error || 'Failed to send order confirmation'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order confirmation sent successfully',
      data: {
        phoneNumber: cleanPhoneNumber,
        messageId: smsResult.messageId
      }
    });

  } catch (error) {
    console.error('Order Confirmation SMS Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending order confirmation'
    });
  }
});

export default router;
