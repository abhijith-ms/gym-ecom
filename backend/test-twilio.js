import dotenv from 'dotenv';
import TwilioSMSService from './services/twilioSmsService.js';

// Load environment variables
dotenv.config();


console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN);
console.log('TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER);

async function testTwilio() {
  console.log('🚀 Testing Twilio SMS Service...\n');
  
  const smsService = new TwilioSMSService();
  
  // Check configuration
  console.log('📋 Configuration Check:');
  console.log('Account SID:', process.env.TWILIO_ACCOUNT_SID ? '✅ Present' : '❌ Missing');
  console.log('Auth Token:', process.env.TWILIO_AUTH_TOKEN ? '✅ Present' : '❌ Missing');
  console.log('Phone Number:', process.env.TWILIO_PHONE_NUMBER ? '✅ Present' : '❌ Missing');
  console.log('Service Configured:', smsService.isConfigured() ? '✅ Yes' : '❌ No');
  console.log('');
  
  if (!smsService.isConfigured()) {
    console.log('❌ Twilio not configured. Please add these to your .env file:');
    console.log('TWILIO_ACCOUNT_SID=your_account_sid');
    console.log('TWILIO_AUTH_TOKEN=your_auth_token');
    console.log('TWILIO_PHONE_NUMBER=your_twilio_phone_number');
    console.log('');
    console.log('📖 Get these from: https://console.twilio.com/');
    return;
  }
  
  // Test phone number validation
  console.log('📱 Testing phone number validation:');
  try {
    const testPhone = '9895905758';
    const cleanPhone = smsService.validatePhoneNumber(testPhone);
    console.log(`✅ Phone validation: ${testPhone} → ${cleanPhone}`);
  } catch (error) {
    console.log(`❌ Phone validation error: ${error.message}`);
  }
  console.log('');
  
  // Test OTP generation
  console.log('🔢 Testing OTP generation:');
  const otp = smsService.generateOTP();
  console.log(`✅ Generated OTP: ${otp}`);
  console.log('');
  
  // Test SMS sending
  console.log('📤 Testing SMS sending:');
  try {
    const testPhone = '+919895905758'; // Replace with your phone number in E.164 format
    console.log(`Sending OTP ${otp} to ${testPhone}...`);
    
    const result = await smsService.sendPhoneVerificationOTP(testPhone, otp);
    
    if (result.success) {
      console.log('✅ SMS sent successfully!');
      console.log('Message ID:', result.messageId);
      console.log('Status:', result.status);
      
      // If you want to check the message status later, you can use:
      // const message = await client.messages(result.messageId).fetch();
      // console.log('Current Status:', message.status);
    } else {
      console.log('❌ SMS failed:', result.error);
      if (result.code) {
        console.log('Error code:', result.code);
      }
      if (result.moreInfo) {
        console.log('More info:', result.moreInfo);
      }
    }
  } catch (error) {
    console.error('❌ Error sending SMS:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      status: error.status,
      moreInfo: error.moreInfo
    });
  }
  
  console.log('\n🎉 Twilio SMS service test completed!');
}

testTwilio().catch(console.error);
