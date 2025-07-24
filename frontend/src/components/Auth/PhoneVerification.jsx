import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import smsAPI from '../../services/smsAPI';

const PhoneVerification = ({ phoneNumber, onVerificationSuccess, onCancel, isRequired = false }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      // Use smsAPI.verifyOTP instead of direct axios call
      const response = await smsAPI.verifyOTP(phoneNumber, otp);
      if (response.success) {
        toast.success('Phone number verified successfully!');
        onVerificationSuccess && onVerificationSuccess(response.data);
      } else {
        toast.error(response.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(error.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);

    try {
      // Use smsAPI.resendOTP instead of direct axios call
      const response = await smsAPI.resendOTP(phoneNumber);
      if (response.success) {
        toast.success('OTP resent successfully!');
        setTimeLeft(600); // Reset timer
        setCanResend(false);
        setOtp(''); // Clear current OTP
      } else {
        toast.error(response.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Phone Number
          </h2>
          <p className="text-gray-600">
            We've sent a 6-digit OTP to
          </p>
          <p className="font-semibold text-scars-red">
            +91 {phoneNumber}
          </p>
        </div>

        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-scars-red focus:border-transparent text-center text-2xl font-mono tracking-widest"
              maxLength={6}
              autoComplete="one-time-code"
              required
            />
          </div>

          <div className="text-center text-sm text-gray-600">
            {timeLeft > 0 ? (
              <p>OTP expires in: <span className="font-semibold text-scars-red">{formatTime(timeLeft)}</span></p>
            ) : (
              <p className="text-red-600">OTP has expired</p>
            )}
          </div>

          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              disabled={loading || !otp || otp.length !== 6}
              className="w-full bg-scars-red text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-scars-red focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify OTP'
              )}
            </button>

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={!canResend || resendLoading}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {resendLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700 mr-2"></div>
                  Resending...
                </div>
              ) : canResend ? (
                'Resend OTP'
              ) : (
                `Resend in ${formatTime(timeLeft)}`
              )}
            </button>

            {!isRequired && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full text-gray-500 py-2 px-4 rounded-lg font-medium hover:text-gray-700 focus:outline-none transition-colors duration-200"
              >
                Skip for now
              </button>
            )}
          </div>
        </form>

        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>Didn't receive the OTP? Check your SMS or try resending.</p>
          <p className="mt-1">For support, contact us at support@scarsclothing.com</p>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerification;
