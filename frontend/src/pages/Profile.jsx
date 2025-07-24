import React, { useEffect, useState } from 'react';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/useStore';
import { toast } from 'react-hot-toast';
import PhoneVerification from '../components/Auth/PhoneVerification';
import smsAPI from '../services/smsAPI';
import EmailVerification from '../components/Auth/EmailVerification';
import Modal from '../components/Common/Modal';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState({ name: '', phone: '', address: { street: '', city: '', state: '', zipCode: '' } });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState(null);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showChangePhone, setShowChangePhone] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [emailStep, setEmailStep] = useState(1); // 1: enter email, 2: enter code
  const [emailLoading, setEmailLoading] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [phoneOTP, setPhoneOTP] = useState('');
  const [phoneStep, setPhoneStep] = useState(1); // 1: enter phone, 2: enter OTP
  const [phoneLoading, setPhoneLoading] = useState(false);

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
      // Clean phone number if it was changed
      const cleanPhone = profile.phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
        toast.error('Please enter a valid 10-digit Indian mobile number');
        setEditing(false);
        return;
      }
      console.log('[FRONTEND] Submitting profile update:', {
        name: profile.name,
        phone: cleanPhone,
        address: profile.address,
      });
      const res = await authAPI.updateProfile({
        name: profile.name,
        phone: cleanPhone,
        address: profile.address,
      });
      updateUser(res.data.user);
      setProfile({ ...profile, phone: cleanPhone });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setEditing(false);
    }
  };

  const handleVerifyPhone = async () => {
    const cleanPhone = profile.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      toast.error('Please enter a valid 10-digit Indian mobile number first');
      return;
    }

    setVerifyingPhone(true);
    try {
      await smsAPI.sendOTP(cleanPhone, 'phone_verification');
      setShowPhoneVerification(true);
      toast.success('OTP sent to your phone number');
    } catch (error) {
      console.error('SMS Error:', error);
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setVerifyingPhone(false);
    }
  };

  const handlePhoneVerificationSuccess = async () => {
    setShowPhoneVerification(false);
    toast.success('Phone number verified successfully!');
    
    // Refresh profile to get updated verification status
    try {
      const res = await authAPI.getProfile();
      setProfile(res.data.user);
      updateUser(res.data.user); // Ensure global store is updated
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const handleCancelVerification = () => {
    setShowPhoneVerification(false);
  };

  const handleVerifyEmail = async () => {
    setVerifyingEmail(true);
    try {
      await authAPI.sendEmailVerification();
      setShowEmailVerification(true);
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send verification email');
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleEmailVerificationSuccess = async () => {
    setShowEmailVerification(false);
    toast.success('Email verified successfully!');
    try {
      const res = await authAPI.getProfile();
      setProfile(res.data.user);
      updateUser(res.data.user);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const handleCancelEmailVerification = () => {
    setShowEmailVerification(false);
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
      console.log('[FRONTEND] Submitting password change:', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmPassword,
      });
      await authAPI.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error('Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  // Change Email Handlers
  const handleRequestEmailChange = async () => {
    setEmailLoading(true);
    try {
      await authAPI.requestEmailChange(newEmail);
      setEmailStep(2);
      toast.success('Verification code sent to new email');
      // (No profile re-fetch here)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send code');
    } finally {
      setEmailLoading(false);
    }
  };
  const handleConfirmEmailChange = async () => {
    setEmailLoading(true);
    try {
      const res = await authAPI.confirmEmailChange(emailCode);
      setShowChangeEmail(false);
      setEmailStep(1);
      setNewEmail('');
      setEmailCode('');
      toast.success('Email updated!');
      // Refresh profile
      const profileRes = await authAPI.getProfile();
      setProfile(profileRes.data.user);
      updateUser(profileRes.data.user);
    } catch (err) {
      if (err.response?.data?.message?.toLowerCase().includes('no email change requested')) {
        toast.error('No email change request found. Please try changing your email again.');
        setEmailStep(1);
        setNewEmail('');
        setEmailCode('');
      } else {
        toast.error(err.response?.data?.message || 'Failed to update email');
      }
    } finally {
      setEmailLoading(false);
    }
  };
  // Change Phone Handlers
  const handleRequestPhoneChange = async () => {
    setPhoneLoading(true);
    try {
      await authAPI.requestPhoneChange(newPhone);
      setPhoneStep(2);
      toast.success('OTP sent to new phone');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setPhoneLoading(false);
    }
  };
  const handleConfirmPhoneChange = async () => {
    setPhoneLoading(true);
    try {
      const res = await authAPI.confirmPhoneChange(phoneOTP);
      setShowChangePhone(false);
      setPhoneStep(1);
      setNewPhone('');
      setPhoneOTP('');
      toast.success('Phone updated!');
      // Refresh profile
      const profileRes = await authAPI.getProfile();
      setProfile(profileRes.data.user);
      updateUser(profileRes.data.user);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update phone');
    } finally {
      setPhoneLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading profile...</div>;

  return (
    <>
      <div className="container mx-auto px-2 md:px-4 py-6 max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>
        {/* Personal Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <h3 className="text-base font-medium mb-4 text-scars-black">Personal Info</h3>
          <div className="grid grid-cols-1 gap-3 mb-2">
            <div className="flex gap-3">
              <input name="name" value={profile.name} onChange={handleChange} required placeholder="Full Name" className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 placeholder-gray-400 focus:ring-2 focus:ring-scars-red/30 focus:border-scars-red outline-none" />
              <div className="relative flex-1">
                <span className="absolute left-3 top-2 text-gray-400 text-xs">+91</span>
                <input 
                  name="phone" 
                  value={profile.phone} 
                  readOnly
                  type="text"
                  className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed font-mono tracking-widest text-sm placeholder-gray-400 focus:ring-2 focus:ring-scars-red/30 focus:border-scars-red outline-none"
                  style={{ fontFamily: 'monospace', letterSpacing: '0.1em', overflowX: 'auto' }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => setShowChangePhone(true)}
                className="flex-1 px-3 py-2 text-sm bg-scars-red text-white rounded-md font-medium hover:bg-red-700 focus:ring-2 focus:ring-scars-red/30 transition"
              >Change Phone</button>
              {profile.isPhoneVerified ? (
                <span className="flex items-center text-green-600 text-xs font-medium">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>Verified
                </span>
              ) : (
                <span className="flex items-center text-orange-600 text-xs font-medium">Not Verified</span>
              )}
            </div>
          </div>
        </div>
        {/* Contact Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <h3 className="text-base font-medium mb-4 text-scars-black">Contact Info</h3>
          <div className="grid grid-cols-1 gap-3 mb-2">
            <input
              name="email"
              value={profile.email || ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed text-sm placeholder-gray-400 focus:ring-2 focus:ring-scars-red/30 focus:border-scars-red outline-none"
              placeholder="Email"
            />
            <div className="flex items-center gap-2 mt-1">
              {!profile.isEmailVerified && (
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  className="px-3 py-2 text-sm bg-yellow-500 text-white rounded-md font-medium hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-300 transition"
                  disabled={verifyingEmail}
                >{verifyingEmail ? 'Sending...' : 'Verify Email'}</button>
              )}
              <button
                type="button"
                onClick={() => setShowChangeEmail(true)}
                className="px-3 py-2 text-sm bg-scars-red text-white rounded-md font-medium hover:bg-red-700 focus:ring-2 focus:ring-scars-red/30 transition"
              >Change Email</button>
              {profile.isEmailVerified ? (
                <span className="flex items-center text-green-600 text-xs font-medium">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>Verified
                </span>
              ) : (
                <span className="flex items-center text-orange-600 text-xs font-medium">Not Verified</span>
              )}
            </div>
          </div>
        </div>
        {/* Address Card */}
        <form onSubmit={handleUpdate} className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <h3 className="text-base font-medium mb-4 text-scars-black">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mb-4">
            <input name="street" value={profile.address?.street || ''} onChange={handleAddressChange} placeholder="Street Address" className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm bg-gray-50 placeholder-gray-400 focus:ring-2 focus:ring-scars-red/30 focus:border-scars-red outline-none md:col-span-2" />
            <input name="city" value={profile.address?.city || ''} onChange={handleAddressChange} placeholder="City" className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm bg-gray-50 placeholder-gray-400 focus:ring-2 focus:ring-scars-red/30 focus:border-scars-red outline-none" />
            <input name="state" value={profile.address?.state || ''} onChange={handleAddressChange} placeholder="State" className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm bg-gray-50 placeholder-gray-400 focus:ring-2 focus:ring-scars-red/30 focus:border-scars-red outline-none" />
            <input name="zipCode" value={profile.address?.zipCode || ''} onChange={handleAddressChange} placeholder="Zip Code" className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm bg-gray-50 placeholder-gray-400 focus:ring-2 focus:ring-scars-red/30 focus:border-scars-red outline-none" />
          </div>
          <button
            type="submit"
            disabled={editing}
            className="bg-black text-white py-2 px-6 rounded-md font-medium hover:bg-gray-800 focus:ring-2 focus:ring-black/20 transition w-full mt-2 text-sm"
          >
            {editing ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
        {/* Change Password Card */}
        <form onSubmit={handlePasswordChange} className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <h3 className="text-base font-medium mb-4 text-scars-black">Change Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mb-4">
            <input
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
              type="password"
              required
              placeholder="Current Password"
              className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm bg-gray-50 placeholder-gray-400 focus:ring-2 focus:ring-scars-red/30 focus:border-scars-red outline-none"
            />
            <input
              name="newPassword"
              value={passwords.newPassword}
              onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
              type="password"
              required
              placeholder="New Password"
              className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm bg-gray-50 placeholder-gray-400 focus:ring-2 focus:ring-scars-red/30 focus:border-scars-red outline-none"
            />
            <input
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              type="password"
              required
              placeholder="Confirm New Password"
              className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm bg-gray-50 placeholder-gray-400 focus:ring-2 focus:ring-scars-red/30 focus:border-scars-red outline-none md:col-span-2"
            />
          </div>
          {pwError && <div className="text-scars-red text-xs mb-2">{pwError}</div>}
          <button
            type="submit"
            disabled={pwLoading}
            className="bg-black text-white py-2 px-6 rounded-md font-medium hover:bg-gray-800 focus:ring-2 focus:ring-black/20 transition w-full mt-2 text-sm"
          >
            {pwLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
        {/* Modals */}
        {showPhoneVerification && (
          <PhoneVerification
            phoneNumber={profile.phone}
            onVerificationSuccess={handlePhoneVerificationSuccess}
            onCancel={handleCancelVerification}
            isRequired={false}
          />
        )}
        {showEmailVerification && (
          <EmailVerification
            onVerificationSuccess={handleEmailVerificationSuccess}
            onCancel={handleCancelEmailVerification}
          />
        )}
        {showChangeEmail && (
          <Modal onClose={() => { setShowChangeEmail(false); setEmailStep(1); setNewEmail(''); setEmailCode(''); }}>
            {emailStep === 1 ? (
              <div>
                <h3 className="text-base font-medium mb-4">Change Email</h3>
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="Enter new email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm placeholder-gray-400 focus:ring-2 focus:ring-scars-red/30 focus:border-scars-red outline-none mb-4"
                />
                <button
                  onClick={handleRequestEmailChange}
                  disabled={emailLoading || !newEmail}
                  className="w-full bg-scars-red text-white py-2 rounded-md font-medium text-sm"
                >{emailLoading ? 'Sending...' : 'Send Code'}</button>
              </div>
            ) : (
              <div>
                <h3 className="text-base font-medium mb-4">Verify New Email</h3>
                <input
                  type="text"
                  value={emailCode}
                  onChange={e => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-center text-xl font-mono tracking-widest placeholder-gray-400 focus:ring-2 focus:ring-scars-red/30 focus:border-scars-red outline-none mb-4"
                  maxLength={6}
                />
                <button
                  onClick={handleConfirmEmailChange}
                  disabled={emailLoading || !emailCode || emailCode.length !== 6}
                  className="w-full bg-scars-red text-white py-2 rounded-md font-medium text-sm"
                >{emailLoading ? 'Verifying...' : 'Verify & Update'}</button>
              </div>
            )}
          </Modal>
        )}
        {showChangePhone && (
          <Modal onClose={() => { setShowChangePhone(false); setPhoneStep(1); setNewPhone(''); setPhoneOTP(''); }}>
            {phoneStep === 1 ? (
              <div>
                <h3 className="text-base font-medium mb-4">Change Phone</h3>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter new phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm placeholder-gray-400 focus:ring-2 focus:ring-scars-red/30 focus:border-scars-red outline-none mb-4"
                  maxLength={10}
                />
                <button
                  onClick={handleRequestPhoneChange}
                  disabled={phoneLoading || !newPhone || newPhone.length !== 10}
                  className="w-full bg-scars-red text-white py-2 rounded-md font-medium text-sm"
                >{phoneLoading ? 'Sending...' : 'Send OTP'}</button>
              </div>
            ) : (
              <div>
                <h3 className="text-base font-medium mb-4">Verify New Phone</h3>
                <input
                  type="text"
                  value={phoneOTP}
                  onChange={e => setPhoneOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-center text-xl font-mono tracking-widest placeholder-gray-400 focus:ring-2 focus:ring-scars-red/30 focus:border-scars-red outline-none mb-4"
                  maxLength={6}
                />
                <button
                  onClick={handleConfirmPhoneChange}
                  disabled={phoneLoading || !phoneOTP || phoneOTP.length !== 6}
                  className="w-full bg-scars-red text-white py-2 rounded-md font-medium text-sm"
                >{phoneLoading ? 'Verifying...' : 'Verify & Update'}</button>
              </div>
            )}
          </Modal>
        )}
      </div>
    </>
  );
};

export default Profile; 