import { useEffect, useState } from "react";
import { api } from "../../services/api";

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/orders");
        setOrders(res.data.orders || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const openModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
    setStatusError(null);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
    setStatusError(null);
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatusUpdating(true);
    setStatusError(null);
    try {
      await api.put(`/orders/${selectedOrder._id}/status`, { status: newStatus });
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      setOrders((prev) => prev.map(o => o._id === selectedOrder._id ? { ...o, status: newStatus } : o));
    } catch (err) {
      setStatusError(err.response?.data?.message || "Failed to update status");
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div className="px-2 md:px-8 py-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      {loading ? (
        <div className="text-center py-10">Loading orders...</div>
      ) : error ? (
        <div className="text-center text-scars-red py-10">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 md:p-3">Order ID</th>
                <th className="p-2 md:p-3">User</th>
                <th className="p-2 md:p-3">Date</th>
                <th className="p-2 md:p-3">Total</th>
                <th className="p-2 md:p-3">Status</th>
                <th className="p-2 md:p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-2 md:p-3 break-all max-w-[80px] md:max-w-xs">{order._id.slice(-6)}</td>
                  <td className="p-2 md:p-3">{order.user?.name || order.user || "-"}</td>
                  <td className="p-2 md:p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-2 md:p-3">₹{order.totalPrice?.toFixed(2)}</td>
                  <td className="p-2 md:p-3 capitalize">{order.status}</td>
                  <td className="p-2 md:p-3">
                    <button className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition text-xs md:text-sm" onClick={() => openModal(order)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 md:p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={closeModal}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">Order Details</h2>
            <div className="mb-2 text-xs md:text-sm">
              <div><span className="font-semibold">Order ID:</span> {selectedOrder._id}</div>
              <div><span className="font-semibold">User:</span> {selectedOrder.user?.name || selectedOrder.user || "-"}</div>
              <div><span className="font-semibold">Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</div>
              <div><span className="font-semibold">Total:</span> ₹{selectedOrder.totalPrice?.toFixed(2)}</div>
              <div><span className="font-semibold">Status:</span> {selectedOrder.status}</div>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Shipping Address:</span>
              <div className="text-xs md:text-sm">
                {selectedOrder.shippingAddress?.name}, {selectedOrder.shippingAddress?.phone}<br />
                {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city},<br />
                {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.zipCode}, {selectedOrder.shippingAddress?.country}
              </div>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Payment:</span> {selectedOrder.paymentMethod}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Items:</span>
              <ul className="divide-y divide-gray-200">
                {selectedOrder.orderItems?.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 py-2">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">Qty: {item.quantity} | Size: {item.size}</div>
                    </div>
                    <div className="font-semibold">₹{item.price}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-2">
              <label className="block font-semibold mb-1">Update Status</label>
              <select
                value={selectedOrder.status}
                onChange={handleStatusChange}
                className="border rounded px-3 py-2 w-full"
                disabled={statusUpdating}
              >
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                ))}
              </select>
              {statusError && <div className="text-scars-red text-xs mt-1">{statusError}</div>}
            </div>
            <button
              className="w-full mt-4 bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 