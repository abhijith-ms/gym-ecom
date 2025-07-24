import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

async function testFast2SMS() {
  const apiKey = process.env.FAST2SMS_API_KEY;
  const testPhone = '9895905758'; // Your test number
  const testOTP = '123456';
  
  console.log('Testing Fast2SMS API...');
  console.log('API Key present:', apiKey ? 'Yes' : 'No');
  console.log('Test phone:', testPhone);
  
  if (!apiKey) {
    console.error('❌ Fast2SMS API key not found in .env file');
    return;
  }
  
  try {
    const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
      variables_values: testOTP,
      route: 'otp',
      numbers: testPhone,
      flash: 0
    }, {
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ SMS API Response:', response.data);
    
    if (response.data.return === true) {
      console.log('🎉 SMS sent successfully!');
      console.log('Message ID:', response.data.request_id);
    } else {
      console.log('❌ SMS failed:', response.data.message);
    }
    
  } catch (error) {
    console.error('❌ SMS API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      console.log('🔑 Check if your Fast2SMS API key is correct');
    } else if (error.response?.status === 400) {
      console.log('📱 Check if phone number format is correct');
    }
  }
}

testFast2SMS();
