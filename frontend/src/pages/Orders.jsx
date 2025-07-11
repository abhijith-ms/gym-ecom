import React, { useEffect, useState } from 'react';
import { ordersAPI } from '../services/api';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await ordersAPI.getMyOrders();
        setOrders(res.data.orders);
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading orders...</div>;
  if (orders.length === 0) return <div className="text-center py-12 text-gray-500">No orders found.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      <div className="flex flex-col gap-6">
        {orders.map(order => (
          <div key={order._id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="font-mono text-sm text-gray-500 mb-1">Order ID: {order._id}</div>
              <div className="mb-2">Placed: {new Date(order.createdAt).toLocaleString()}</div>
              <div className="mb-2">Status: <span className="font-semibold">{order.status}</span></div>
              <div className="mb-2">Total: <span className="font-bold">${order.totalPrice.toFixed(2)}</span></div>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <Link to={`/order-confirmation/${order._id}`} className="text-indigo-600 hover:underline font-semibold">View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders; 