import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with better error handling
const api = axios.create({
  baseURL: `${API_URL}/sms`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Sending request to:', config.url, config.data);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

const smsAPI = {
  // Send OTP for phone verification
  sendOTP: async (phoneNumber, purpose = 'phone_verification') => {
    try {
      console.log(`Sending OTP to ${phoneNumber} for ${purpose}`);
      const response = await api.post('/send-otp', {
        phoneNumber,
        purpose
      });
      return response.data;
    } catch (error) {
      console.error('Error in sendOTP:', {
        phoneNumber,
        error: error.response?.data || error.message,
      });
      throw error;
    }
  },

  // Verify OTP
  verifyOTP: async (phoneNumber, otp) => {
    try {
      console.log(`Verifying OTP for ${phoneNumber}`);
      const response = await api.post('/verify-otp', {
        phoneNumber,
        otp
      });
      return response.data;
    } catch (error) {
      console.error('Error in verifyOTP:', {
        phoneNumber,
        error: error.response?.data || error.message,
      });
      throw error;
    }
  },

  // Resend OTP
  resendOTP: async (phoneNumber) => {
    try {
      console.log(`Resending OTP to ${phoneNumber}`);
      const response = await api.post('/resend-otp', {
        phoneNumber
      });
      return response.data;
    } catch (error) {
      console.error('Error in resendOTP:', {
        phoneNumber,
        error: error.response?.data || error.message,
      });
      throw error;
    }
  },

  // Send order confirmation (admin/system use)
  sendOrderConfirmation: async (phoneNumber, orderDetails) => {
    try {
      console.log(`Sending order confirmation to ${phoneNumber}`);
      const response = await api.post('/order-confirmation', {
        phoneNumber,
        orderDetails
      });
      return response.data;
    } catch (error) {
      console.error('Error in sendOrderConfirmation:', {
        phoneNumber,
        error: error.response?.data || error.message,
      });
      throw error;
    }
  }
};

export default smsAPI;
