import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import paymentAPI from '../../services/paymentAPI';

const RazorpayPayment = ({ 
  order, 
  onSuccess, 
  onFailure, 
  onCancel,
  disabled = false,
  buttonText = "Pay Now",
  buttonClass = "w-full bg-scars-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
}) => {
  const [loading, setLoading] = useState(false);
  const [razorpayKey, setRazorpayKey] = useState('');

  useEffect(() => {
    // Get Razorpay key on component mount
    const fetchRazorpayKey = async () => {
      try {
        console.log('RazorpayPayment: Fetching Razorpay config...');
        const config = await paymentAPI.getConfig();
        console.log('RazorpayPayment: Config received:', config);
        setRazorpayKey(config.key);
        console.log('RazorpayPayment: Razorpay key set:', config.key);
      } catch (error) {
        console.error('RazorpayPayment: Failed to fetch Razorpay config:', error);
        console.error('RazorpayPayment: Error details:', error.response?.data || error.message);
        toast.error('Payment configuration error');
      }
    };

    fetchRazorpayKey();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    console.log('RazorpayPayment: handlePayment called with order:', order);
    
    if (!order || !order._id || !order.totalAmount) {
      console.error('RazorpayPayment: Invalid order data:', { order, hasId: !!order?._id, hasAmount: !!order?.totalAmount });
      toast.error('Invalid order data');
      return;
    }

    console.log('RazorpayPayment: Order validation passed');
    setLoading(true);

    try {
      // Check authentication
      const token = localStorage.getItem('token');
      console.log('RazorpayPayment: Auth token exists:', !!token);
      
      // Load Razorpay script
      console.log('RazorpayPayment: Loading Razorpay script...');
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        console.error('RazorpayPayment: Failed to load Razorpay script');
        toast.error('Failed to load payment gateway');
        setLoading(false);
        return;
      }
      console.log('RazorpayPayment: Razorpay script loaded successfully');

      // Create Razorpay order
      const orderPayload = {
        amount: order.totalAmount,
        orderId: order._id,
        currency: 'INR'
      };
      console.log('RazorpayPayment: Creating Razorpay order with payload:', orderPayload);
      
      const orderData = await paymentAPI.createOrder(orderPayload);
      console.log('RazorpayPayment: Razorpay order created successfully:', orderData);

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

      // Razorpay options
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'SCARS Clothing',
        description: `Order #${order._id.slice(-8)}`,
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verificationData = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id
            });

            if (verificationData.success) {
              toast.success('Payment successful!');
              onSuccess && onSuccess(verificationData.order);
            } else {
              throw new Error(verificationData.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error(error.message || 'Payment verification failed');
            onFailure && onFailure(error);
          }
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
            onCancel && onCancel();
            setLoading(false);
          }
        },
        prefill: {
          name: order.shippingAddress?.fullName || '',
          email: order.user?.email || '',
          contact: order.shippingAddress?.phone || ''
        },
        theme: {
          color: '#DC2626' // SCARS red color
        },
        retry: {
          enabled: true,
          max_count: 3
        }
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', async (response) => {
        try {
          await paymentAPI.handlePaymentFailure({
            orderId: order._id,
            error: response.error
          });
          
          toast.error(`Payment failed: ${response.error.description}`);
          onFailure && onFailure(response.error);
        } catch (error) {
          console.error('Failed to handle payment failure:', error);
        }
        setLoading(false);
      });

      razorpay.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error(error.message || 'Failed to initiate payment');
      onFailure && onFailure(error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || loading || !razorpayKey}
      className={`${buttonClass} ${
        (disabled || loading || !razorpayKey) 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:shadow-lg transform hover:scale-105'
      } transition-all duration-200`}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Processing...
        </div>
      ) : (
        buttonText
      )}
    </button>
  );
};

export default RazorpayPayment;
