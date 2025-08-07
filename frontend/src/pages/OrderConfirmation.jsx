import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await ordersAPI.getById(orderId);
        setOrder(res.data.order);
      } catch (err) {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading order...</div>;
  if (!order) return <div className="text-center py-12 text-gray-500">Order not found.</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
      <h2 className="text-3xl font-bold mb-4">Thank you for your order!</h2>
      <p className="mb-6">Your order <span className="font-mono bg-gray-100 px-2 py-1 rounded">{order._id}</span> has been placed successfully.</p>
      <div className="bg-white rounded-lg shadow p-6 mb-8 text-left">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <ul className="mb-4">
          {order.orderItems.map((item, idx) => (
            <li key={idx} className="flex justify-between mb-2">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>₹{order.totalPrice.toFixed(2)}</span>
        </div>
      </div>
      <Link to="/orders" className="inline-block bg-black text-white py-3 px-8 rounded-lg font-semibold hover:bg-gray-800 transition">
        View My Orders
      </Link>
    </div>
  );
};

export default OrderConfirmation; 