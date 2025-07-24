import twilio from 'twilio';

class TwilioSMSService {
  constructor() {
    console.log('TwilioSMSService constructor:');
    console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
    console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN);
    console.log('TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER);
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
    
    if (!this.accountSid || !this.authToken || !this.fromNumber) {
      console.error('Twilio credentials not found in environment variables');
      console.log('Required: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER');
    } else {
      this.client = twilio(this.accountSid, this.authToken);
      console.log('✅ Twilio SMS service initialized');
    }
  }

  // Generate 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Format phone number for Twilio (needs +91 prefix for Indian numbers)
  formatPhoneNumber(phoneNumber) {
    // Remove any existing country code and formatting
    const cleanPhone = phoneNumber.replace(/[^\d]/g, '');
    
    // Add +91 for Indian numbers if not present
    if (cleanPhone.length === 10 && cleanPhone.match(/^[6-9]/)) {
      return `+91${cleanPhone}`;
    } else if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
      return `+${cleanPhone}`;
    } else if (cleanPhone.length === 13 && cleanPhone.startsWith('+91')) {
      return cleanPhone;
    }
    
    // Default: assume it's an Indian number
    return `+91${cleanPhone}`;
  }

  // Send OTP for phone verification
  async sendPhoneVerificationOTP(phoneNumber, otp) {
    try {
      if (!this.client) {
        throw new Error('Twilio client not initialized - check credentials');
      }

      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const message = `Your SCARS verification code is: ${otp}. Valid for 10 minutes. Do not share this code with anyone.`;
      
      console.log(`Sending OTP to ${formattedPhone}...`);
      
      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedPhone
      });

      console.log('✅ Twilio OTP SMS sent successfully:', {
        sid: result.sid,
        status: result.status,
        to: formattedPhone
      });

      return {
        success: true,
        messageId: result.sid,
        message: 'OTP sent successfully',
        status: result.status
      };

    } catch (error) {
      console.error('❌ Twilio OTP SMS Error:', {
        message: error.message,
        code: error.code,
        status: error.status,
        phone: phoneNumber
      });

      return {
        success: false,
        error: error.message || 'Failed to send OTP',
        code: error.code
      };
    }
  }

  // Send order confirmation SMS
  async sendOrderConfirmation(phoneNumber, orderDetails) {
    try {
      if (!this.client) {
        throw new Error('Twilio client not initialized - check credentials');
      }

      const { orderId, totalAmount, items } = orderDetails;
      const itemCount = items.length;
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      const message = `🎉 SCARS Order Confirmed! Order #${orderId.slice(-8)} for ₹${totalAmount} (${itemCount} items). Track your order in the app. Thank you for shopping with us!`;
      
      console.log(`Sending order confirmation to ${formattedPhone}...`);
      
      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedPhone
      });

      console.log('✅ Twilio Order SMS sent successfully:', {
        sid: result.sid,
        status: result.status,
        to: formattedPhone
      });

      return {
        success: true,
        messageId: result.sid,
        message: 'Order confirmation sent successfully',
        status: result.status
      };

    } catch (error) {
      console.error('❌ Twilio Order SMS Error:', {
        message: error.message,
        code: error.code,
        status: error.status,
        phone: phoneNumber
      });

      return {
        success: false,
        error: error.message || 'Failed to send order confirmation',
        code: error.code
      };
    }
  }

  // Validate and clean phone number
  validatePhoneNumber(phoneNumber) {
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    // Remove all non-digit characters
    const cleanPhone = phoneNumber.replace(/[^\d]/g, '');
    
    // Check if it's a valid Indian mobile number
    if (cleanPhone.length === 10 && cleanPhone.match(/^[6-9]/)) {
      return cleanPhone;
    } else if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
      return cleanPhone.substring(2);
    }
    
    throw new Error('Invalid Indian mobile number. Must be 10 digits starting with 6-9.');
  }

  // Check if Twilio is properly configured
  isConfigured() {
    return !!(this.accountSid && this.authToken && this.fromNumber && this.client);
  }

  // Test SMS functionality
  async testSMS(phoneNumber) {
    try {
      const testOTP = this.generateOTP();
      const result = await this.sendPhoneVerificationOTP(phoneNumber, testOTP);
      
      console.log('📱 SMS Test Result:', result);
      return result;
    } catch (error) {
      console.error('❌ SMS Test Failed:', error);
      return { success: false, error: error.message };
    }
  }
}

export default TwilioSMSService;
