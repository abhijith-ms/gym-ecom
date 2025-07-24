import { api } from './api';

const paymentAPI = {
  // Create Razorpay order
  createOrder: async (orderData) => {
    const response = await api.post('/payments/create-order', orderData);
    return response.data;
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    const response = await api.post('/payments/verify-payment', paymentData);
    return response.data;
  },

  // Handle payment failure
  handlePaymentFailure: async (failureData) => {
    const response = await api.post('/payments/payment-failed', failureData);
    return response.data;
  },

  // Get Razorpay configuration
  getConfig: async () => {
    const response = await api.get('/payments/config');
    return response.data;
  }
};

export default paymentAPI;
