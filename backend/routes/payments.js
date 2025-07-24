import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { protect } from '../middleware/auth.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import TwilioSMSService from '../services/twilioSmsService.js';
const smsService = new TwilioSMSService();

const router = express.Router();

// Initialize Razorpay lazily to ensure env vars are loaded
let razorpay;
const getRazorpay = () => {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
};

// Create Razorpay order
router.post('/create-order', protect, async (req, res) => {
  try {
    console.log('Payment create-order called with body:', req.body);
    console.log('User ID:', req.user.id);
    
    const { amount, currency = 'INR', orderId } = req.body;

    // Validate required fields
    if (!amount || !orderId) {
      console.log('Validation failed - missing amount or orderId');
      return res.status(400).json({
        success: false,
        message: 'Amount and order ID are required'
      });
    }

    console.log('Looking for order with ID:', orderId, 'for user:', req.user.id);
    
    // Verify the order exists and belongs to the user
    const order = await Order.findOne({ 
      _id: orderId, 
      user: req.user.id,
      status: 'pending'
    });

    console.log('Order found:', !!order);
    if (order) {
      console.log('Order details:', { id: order._id, status: order.status, user: order.user });
    }

    if (!order) {
      console.log('Order not found or already processed');
      return res.status(404).json({
        success: false,
        message: 'Order not found or already processed'
      });
    }

    console.log('Creating Razorpay order with amount:', amount, 'currency:', currency);
    console.log('Razorpay instance available:', !!getRazorpay());
    
    // Create Razorpay order
    const razorpayOrder = await getRazorpay().orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `order_${orderId}`,
      notes: {
        orderId: orderId.toString(),
        userId: req.user.id.toString()
      }
    });
    
    console.log('Razorpay order created successfully:', razorpayOrder.id);

    // Update order with Razorpay order ID
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Verify Razorpay payment
router.post('/verify-payment', protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification data'
      });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed - invalid signature'
      });
    }

    // Find and update the order
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
      razorpayOrderId: razorpay_order_id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order with payment details
    order.razorpayPaymentId = razorpay_payment_id;
    order.paymentStatus = 'completed';
    order.orderStatus = 'confirmed';
    order.paidAt = new Date();
    
    await order.save();

    // Send SMS confirmation if SMS service is configured and user has verified phone
    try {
      const user = await User.findById(req.user.id);
      if (smsService.isConfigured() && user && user.phone && user.isPhoneVerified) {
        const orderDetails = {
          orderId: order._id,
          totalAmount: order.totalPrice,
          items: order.orderItems
        };
        
        const smsResult = await smsService.sendOrderConfirmation(user.phone, orderDetails);
        console.log('Order confirmation SMS result:', smsResult);
      }
    } catch (smsError) {
      console.error('Failed to send order confirmation SMS:', smsError);
      // Don't fail the payment verification if SMS fails
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      order: {
        id: order._id,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        paidAt: order.paidAt
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Handle payment failure
router.post('/payment-failed', protect, async (req, res) => {
  try {
    const { orderId, error } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    // Find and update the order
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order status
    order.paymentStatus = 'failed';
    order.orderStatus = 'cancelled';
    
    await order.save();

    res.json({
      success: true,
      message: 'Payment failure recorded',
      order: {
        id: order._id,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus
      }
    });

  } catch (error) {
    console.error('Payment failure handling error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to handle payment failure',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get Razorpay key for frontend
router.get('/config', (req, res) => {
  res.json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID
  });
});

export default router; 