import React, { useState } from 'react';
import { useCartStore } from '../store/useStore';
import { useAuthStore } from '../store/useStore';
import { ordersAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import RazorpayPayment from '../components/Payment/RazorpayPayment';

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [currentOrder, setCurrentOrder] = useState(null);
  const navigate = useNavigate();

  // Prefill address from user profile on mount
  React.useEffect(() => {
    if (user && user.address && !address.street && !address.city && !address.state && !address.zipCode) {
      setAddress({
        name: user.name || '',
        phone: user.phone || '',
        street: user.address.street || '',
        city: user.address.city || '',
        state: user.address.state || '',
        zipCode: user.address.zipCode || '',
      });
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-gray-500">
        Your cart is empty.
      </div>
    );
  }

  const handleChange = e => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const createOrder = async () => {
    console.log('Creating order with data:', { items, address, paymentMethod });
    
    // Check stock before submitting
    for (const item of items) {
      if (item.quantity > item.product.stock) {
        toast.error(`Insufficient stock for ${item.product.name}. Available: ${item.product.stock}`);
        return null;
      }
    }
    
    try {
      const orderItems = items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        size: item.size,
        price: item.price,
        image: item.product.images[0]?.url || '',
      }));
      
      const orderData = {
        orderItems,
        shippingAddress: address,
        paymentMethod,
      };
      
      console.log('Sending order data:', orderData);
      const res = await ordersAPI.create(orderData);
      console.log('Order created successfully:', res.data);
      return res.data.order;
    } catch (err) {
      console.error('Order creation error:', err.response?.data || err.message);
      console.error('Full error:', err);
      toast.error(err.response?.data?.message || 'Failed to create order');
      return null;
    }
  };

  const handleCODSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const order = await createOrder();
      if (order) {
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order-confirmation/${order._id}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayOrder = async () => {
    console.log('handleRazorpayOrder called');
    setLoading(true);
    
    try {
      const order = await createOrder();
      console.log('Order returned from createOrder:', order);
      if (order) {
        // Ensure the order has the required fields for RazorpayPayment
        const processedOrder = {
          ...order,
          _id: order._id || order.id,
          totalAmount: order.totalPrice || order.itemsPrice
        };
        console.log('Setting currentOrder with processed data:', processedOrder);
        setCurrentOrder(processedOrder);
        console.log('currentOrder state should be set now');
        // Payment will be handled by RazorpayPayment component
      } else {
        console.log('No order returned, cannot proceed to payment');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (updatedOrder) => {
    clearCart();
    toast.success('Payment successful! Order confirmed.');
    navigate(`/order-confirmation/${updatedOrder.id}`);
  };

  const handlePaymentFailure = (error) => {
    console.error('Payment failed:', error);
    setCurrentOrder(null);
    setLoading(false);
  };

  const handlePaymentCancel = () => {
    setCurrentOrder(null);
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input name="name" value={address.name} onChange={handleChange} required placeholder="Full Name" className="border rounded px-3 py-2" />
          <input name="phone" value={address.phone} onChange={handleChange} required placeholder="Phone Number" className="border rounded px-3 py-2" />
          <input name="street" value={address.street} onChange={handleChange} required placeholder="Street Address" className="border rounded px-3 py-2 md:col-span-2" />
          <input name="city" value={address.city} onChange={handleChange} required placeholder="City" className="border rounded px-3 py-2" />
          <input name="state" value={address.state} onChange={handleChange} required placeholder="State" className="border rounded px-3 py-2" />
          <input name="zipCode" value={address.zipCode} onChange={handleChange} required placeholder="Zip Code" className="border rounded px-3 py-2" />
        </div>
        
        {/* Payment Method Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
          
          {/* Free Shipping Notice */}
          {getTotalPrice() < 1000 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Free shipping on orders above ₹1000!</strong> Add ₹{(1000 - getTotalPrice()).toFixed(2)} more to your cart to get free shipping.
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="razorpay"
                checked={paymentMethod === 'razorpay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">R</span>
                </div>
                <div>
                  <div className="font-medium">Online Payment (Razorpay)</div>
                  <div className="text-sm text-gray-500">Pay securely with UPI, Cards, Net Banking</div>
                </div>
              </div>
            </label>
            
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded mr-3 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">₹</span>
                </div>
                <div>
                  <div className="font-medium">Cash on Delivery</div>
                  <div className="text-sm text-gray-500">Pay when your order arrives</div>
                </div>
              </div>
            </label>
          </div>
        </div>
        
        {/* Payment Buttons */}
        {paymentMethod === 'razorpay' ? (
          currentOrder ? (
            <RazorpayPayment
              order={currentOrder}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
              onCancel={handlePaymentCancel}
              buttonText="Complete Payment"
              buttonClass="w-full bg-scars-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            />
          ) : (
            <button
              onClick={handleRazorpayOrder}
              disabled={loading || !address.name || !address.phone || !address.street || !address.city}
              className="w-full bg-scars-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Order...
                </div>
              ) : (
                'Proceed to Payment'
              )}
            </button>
          )
        ) : (
          <form onSubmit={handleCODSubmit}>
            <button
              type="submit"
              disabled={loading || !address.name || !address.phone || !address.street || !address.city}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Placing Order...
                </div>
              ) : (
                'Place Order (COD)'
              )}
            </button>
          </form>
        )}
      </div>
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <ul className="mb-4">
          {items.map((item, idx) => (
            <li key={idx} className="flex justify-between mb-2">
              <span>{item.product.name} x {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        
        {/* Price Breakdown */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{getTotalPrice().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (18%):</span>
            <span>₹{(getTotalPrice() * 0.18).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>{getTotalPrice() > 1000 ? 'Free' : '₹100.00'}</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₹{(getTotalPrice() + (getTotalPrice() * 0.18) + (getTotalPrice() > 1000 ? 0 : 100)).toFixed(2)}</span>
            </div>
          </div>
          {paymentMethod === 'razorpay' && (
            <div className="text-sm text-gray-500 mt-2">
              Secure payment powered by Razorpay
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout; 