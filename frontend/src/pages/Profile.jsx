import React, { useEffect, useState } from 'react';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/useStore';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState({ name: '', phone: '', address: {} });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await authAPI.getProfile();
        setProfile(res.data.user);
      } catch (err) {
        setProfile({ name: '', phone: '', address: {} });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handleAddressChange = e => {
    setProfile({ ...profile, address: { ...profile.address, [e.target.name]: e.target.value } });
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setEditing(true);
    try {
      const res = await authAPI.updateProfile({
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
      });
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setEditing(false);
    }
  };

  const handlePasswordChange = async e => {
    e.preventDefault();
    setPwError(null);
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPwError('New password and confirm password do not match.');
      return;
    }
    setPwLoading(true);
    try {
      await authAPI.changePassword(passwords);
      toast.success('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error('Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading profile...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      <form onSubmit={handleUpdate} className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input name="name" value={profile.name} onChange={handleChange} required placeholder="Full Name" className="border rounded px-3 py-2" />
          <input name="phone" value={profile.phone} onChange={handleChange} required placeholder="Phone Number" className="border rounded px-3 py-2" />
          <input name="street" value={profile.address?.street || ''} onChange={handleAddressChange} placeholder="Street Address" className="border rounded px-3 py-2 md:col-span-2" />
          <input name="city" value={profile.address?.city || ''} onChange={handleAddressChange} placeholder="City" className="border rounded px-3 py-2" />
          <input name="state" value={profile.address?.state || ''} onChange={handleAddressChange} placeholder="State" className="border rounded px-3 py-2" />
          <input name="zipCode" value={profile.address?.zipCode || ''} onChange={handleAddressChange} placeholder="Zip Code" className="border rounded px-3 py-2" />
          <input name="country" value={profile.address?.country || ''} onChange={handleAddressChange} placeholder="Country" className="border rounded px-3 py-2" />
        </div>
        <button
          type="submit"
          disabled={editing}
          className="bg-black text-white py-3 px-8 rounded-lg font-semibold hover:bg-gray-800 transition w-full mt-4"
        >
          {editing ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
      <form onSubmit={handlePasswordChange} className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
            type="password"
            required
            placeholder="Current Password"
            className="border rounded px-3 py-2"
          />
          <input
            name="newPassword"
            value={passwords.newPassword}
            onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
            type="password"
            required
            placeholder="New Password"
            className="border rounded px-3 py-2"
          />
          <input
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            type="password"
            required
            placeholder="Confirm New Password"
            className="border rounded px-3 py-2 md:col-span-2"
          />
        </div>
        {pwError && <div className="text-scars-red text-sm mb-2">{pwError}</div>}
        <button
          type="submit"
          disabled={pwLoading}
          className="bg-black text-white py-3 px-8 rounded-lg font-semibold hover:bg-gray-800 transition w-full mt-4"
        >
          {pwLoading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default Profile; 