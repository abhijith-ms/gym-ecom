import axios from 'axios';
import { createHash } from 'crypto';

class SMSService {
  constructor() {
    this.apiKey = process.env.FAST2SMS_API_KEY;
    this.baseURL = 'https://www.fast2sms.com/dev/bulkV2';
    this.senderId = process.env.FAST2SMS_SENDER_ID || 'FSTSMS';
    
    if (!this.apiKey) {
      console.error('Fast2SMS API key not found in environment variables');
    }
  }

  // Generate 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP for phone verification
  async sendPhoneVerificationOTP(phoneNumber, otp) {
    try {
      // Clean phone number (remove +91 if present)
      const cleanPhone = phoneNumber.replace(/^\+?91/, '');
      
      const response = await axios.post(this.baseURL, {
        variables_values: otp,
        route: 'otp',
        numbers: cleanPhone,
        flash: 0
      }, {
        headers: {
          'authorization': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      console.log('SMS OTP Response:', response.data);
      
      // Fast2SMS returns success as boolean in 'return' field
      if (response.data && response.data.return === true) {
        return {
          success: true,
          messageId: response.data.request_id,
          message: 'OTP sent successfully'
        };
      } else {
        console.error('Fast2SMS API Error:', response.data);
        return {
          success: false,
          error: response.data?.message || 'SMS API returned failure'
        };
      }
    } catch (error) {
      console.error('SMS OTP Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        apiKey: this.apiKey ? 'Present' : 'Missing'
      });
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to send OTP'
      };
    }
  }

  // Send order confirmation SMS
  async sendOrderConfirmation(phoneNumber, orderDetails) {
    try {
      const { orderId, totalAmount, items } = orderDetails;
      const itemCount = items.length;
      
      // Clean phone number (remove +91 if present)
      const cleanPhone = phoneNumber.replace(/^\+?91/, '');
      
      const message = `SCARS Order Confirmed! Order #${orderId.slice(-8)} for Rs${totalAmount} (${itemCount} items). Track your order in the app. Thank you for shopping with us!`;
      
      const response = await axios.post(this.baseURL, {
        message: message,
        language: 'english',
        route: 'q',
        numbers: cleanPhone,
        sender_id: this.senderId,
        flash: 0
      }, {
        headers: {
          'authorization': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      console.log('Order SMS Response:', response.data);
      return {
        success: response.data.return,
        messageId: response.data.request_id,
        message: 'Order confirmation sent successfully'
      };
    } catch (error) {
      console.error('Order SMS Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send order confirmation'
      };
    }
  }

  // Send shipping update SMS
  async sendShippingUpdate(phoneNumber, shippingDetails) {
    try {
      const { orderId, status, trackingId } = shippingDetails;
      
      let message = `SCARS Update: Order #${orderId.slice(-8)} is ${status}.`;
      if (trackingId) {
        message += ` Track: ${trackingId}`;
      }
      message += ` Check app for details.`;
      
      const response = await axios.post(this.baseURL, {
        message: message,
        language: 'english',
        route: 'q',
        numbers: phoneNumber,
        sender_id: this.senderId,
        flash: 0
      }, {
        headers: {
          'authorization': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      console.log('Shipping SMS Response:', response.data);
      return {
        success: response.data.return,
        messageId: response.data.request_id,
        message: 'Shipping update sent successfully'
      };
    } catch (error) {
      console.error('Shipping SMS Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send shipping update'
      };
    }
  }

  // Validate phone number format
  validatePhoneNumber(phoneNumber) {
    // Remove any non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Check if it's a valid Indian mobile number
    if (cleanNumber.length === 10 && /^[6-9]/.test(cleanNumber)) {
      return cleanNumber;
    } else if (cleanNumber.length === 12 && cleanNumber.startsWith('91')) {
      return cleanNumber.substring(2);
    } else if (cleanNumber.length === 13 && cleanNumber.startsWith('+91')) {
      return cleanNumber.substring(3);
    }
    
    return null;
  }

  // Check if SMS service is configured
  isConfigured() {
    return !!this.apiKey;
  }
}

export default new SMSService();
