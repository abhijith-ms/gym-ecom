import { useEffect, useState } from "react";
import { api } from "../../services/api";

const roleOptions = ["user", "admin"];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [roleUpdating, setRoleUpdating] = useState(null); // userId or null
  const [roleError, setRoleError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // userId or null
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (search) params.search = search;
        const res = await api.get("/users", { params });
        setUsers(res.data.users || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [search]);

  const handleRoleChange = async (userId, newRole) => {
    setRoleUpdating(userId);
    setRoleError(null);
    try {
      await api.put(`/users/${userId}`, { role: newRole });
      setUsers(users => users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      setRoleError(err.response?.data?.message || "Failed to update role");
    } finally {
      setRoleUpdating(null);
    }
  };

  const handleBlockToggle = async (userId, currentStatus) => {
    setActionLoading(true);
    setActionError(null);
    try {
      await api.put(`/users/${userId}`, { active: !currentStatus });
      setUsers(users => users.map(u => u._id === userId ? { ...u, active: !currentStatus } : u));
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = async (user) => {
    setSelectedUser(user);
    setModalOpen(true);
    setOrders([]);
    setOrdersLoading(true);
    try {
      // Fetch all orders and filter by user (or use a dedicated endpoint if available)
      const res = await api.get("/orders", { params: { user: user._id } });
      setOrders(res.data.orders?.filter(o => o.user?._id === user._id || o.user === user._id) || []);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setOrders([]);
    setActionError(null);
  };

  const handleDelete = async (userId) => {
    setActionLoading(true);
    setActionError(null);
    try {
      await api.delete(`/users/${userId}`);
      setUsers(users => users.filter(u => u._id !== userId));
      setDeleteConfirm(null);
      if (selectedUser && selectedUser._id === userId) closeModal();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="px-2 md:px-8 py-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-64"
        />
      </div>
      {loading ? (
        <div className="text-center py-10">Loading users...</div>
      ) : error ? (
        <div className="text-center text-scars-red py-10">{error}</div>
      ) : users.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 md:p-3">Name</th>
                <th className="p-2 md:p-3">Email</th>
                <th className="p-2 md:p-3">Role</th>
                <th className="p-2 md:p-3">Status</th>
                <th className="p-2 md:p-3">Registered</th>
                <th className="p-2 md:p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-2 md:p-3 break-all max-w-[120px] md:max-w-xs">{user.name}</td>
                  <td className="p-2 md:p-3 break-all max-w-[120px] md:max-w-xs">{user.email}</td>
                  <td className="p-2 md:p-3 capitalize">{user.role}</td>
                  <td className="p-2 md:p-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${user.active === false ? "bg-red-100 text-scars-red" : "bg-green-100 text-green-700"}`}>
                      {user.active === false ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="p-2 md:p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-2 md:p-3 flex flex-col gap-1 sm:flex-row sm:gap-2">
                    <select
                      value={user.role}
                      onChange={e => handleRoleChange(user._id, e.target.value)}
                      className="border rounded px-2 py-1"
                      disabled={roleUpdating === user._id}
                    >
                      {roleOptions.map(opt => (
                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                      ))}
                    </select>
                    <button
                      className={`px-2 py-1 rounded text-xs font-semibold ${user.active === false ? "bg-green-600 text-white hover:bg-green-700" : "bg-scars-red text-white hover:bg-red-700"}`}
                      onClick={() => handleBlockToggle(user._id, user.active !== false)}
                      disabled={actionLoading}
                    >
                      {user.active === false ? "Unblock" : "Block"}
                    </button>
                    <button
                      className="px-2 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                      onClick={() => openModal(user)}
                    >
                      View</button>
                    <button
                      className="px-2 py-1 rounded bg-scars-red text-white text-xs font-semibold hover:bg-red-700"
                      onClick={() => setDeleteConfirm(user._id)}
                      disabled={actionLoading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {roleError && <div className="text-scars-red text-xs mt-2">{roleError}</div>}
          {actionError && <div className="text-scars-red text-xs mt-2">{actionError}</div>}
        </div>
      )}

      {/* User Details Modal */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 md:p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={closeModal}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">User Details</h2>
            <div className="mb-2 text-xs md:text-sm">
              <div><span className="font-semibold">Name:</span> {selectedUser.name}</div>
              <div><span className="font-semibold">Email:</span> {selectedUser.email}</div>
              <div><span className="font-semibold">Role:</span> {selectedUser.role}</div>
              <div><span className="font-semibold">Status:</span> {selectedUser.active === false ? "Blocked" : "Active"}</div>
              <div><span className="font-semibold">Registered:</span> {new Date(selectedUser.createdAt).toLocaleString()}</div>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Orders:</span>
              {ordersLoading ? (
                <div className="text-xs text-gray-500 mt-1">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-xs text-gray-500 mt-1">No orders found.</div>
              ) : (
                <ul className="divide-y divide-gray-200 mt-1">
                  {orders.map(order => (
                    <li key={order._id} className="py-2 flex flex-col gap-1">
                      <div className="font-mono text-xs text-gray-500">Order ID: {order._id}</div>
                      <div>Date: {new Date(order.createdAt).toLocaleString()}</div>
                      <div>Status: <span className="font-semibold">{order.status}</span></div>
                      <div>Total: <span className="font-bold">₹{order.totalPrice?.toFixed(2)}</span></div>
                    </li>
                  ))}
                </ul>
              )}
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

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xs p-6 relative">
            <h2 className="text-lg font-bold mb-4">Delete User?</h2>
            <p className="mb-4 text-sm">Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex gap-2">
              <button
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
                onClick={() => setDeleteConfirm(null)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-scars-red text-white py-2 rounded hover:bg-red-700"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={actionLoading}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 