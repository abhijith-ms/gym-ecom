import React, { useState } from 'react';
import { useCartStore } from '../store/useStore';
import { ordersAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Cart items:', items);
      const orderItems = items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.price,
        image: item.product.images[0]?.url || '',
      }));
      const orderData = {
        orderItems,
        shippingAddress: address,
        paymentMethod: 'cod',
      };
      console.log('Order data being sent:', orderData);
      const res = await ordersAPI.create(orderData);
      console.log('Order response:', res.data);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${res.data.order._id}`);
    } catch (err) {
      console.error('Order creation error:', err.response?.data);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input name="name" value={address.name} onChange={handleChange} required placeholder="Full Name" className="border rounded px-3 py-2" />
          <input name="phone" value={address.phone} onChange={handleChange} required placeholder="Phone Number" className="border rounded px-3 py-2" />
          <input name="street" value={address.street} onChange={handleChange} required placeholder="Street Address" className="border rounded px-3 py-2 md:col-span-2" />
          <input name="city" value={address.city} onChange={handleChange} required placeholder="City" className="border rounded px-3 py-2" />
          <input name="state" value={address.state} onChange={handleChange} required placeholder="State" className="border rounded px-3 py-2" />
          <input name="zipCode" value={address.zipCode} onChange={handleChange} required placeholder="Zip Code" className="border rounded px-3 py-2" />
          <input name="country" value={address.country} onChange={handleChange} required placeholder="Country" className="border rounded px-3 py-2" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-3 px-8 rounded-lg font-semibold hover:bg-gray-800 transition w-full mt-4"
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <ul className="mb-4">
          {items.map((item, idx) => (
            <li key={idx} className="flex justify-between mb-2">
              <span>{item.product.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>${getTotalPrice().toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 