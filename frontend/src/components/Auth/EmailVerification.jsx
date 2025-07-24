import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { authAPI } from '../../services/api';

const EmailVerification = ({ onVerificationSuccess, onCancel }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code || code.length < 6) {
      toast.error('Please enter the 6-digit code sent to your email');
      return;
    }
    setLoading(true);
    try {
      await authAPI.verifyEmail(code);
      toast.success('Email verified successfully!');
      onVerificationSuccess && onVerificationSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h2>
          <p className="text-gray-600">
            We've sent a 6-digit code to your email address.<br/>
            Please enter it below to verify your email.
          </p>
        </div>
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-scars-red focus:border-transparent text-center text-2xl font-mono tracking-widest"
            maxLength={6}
            autoComplete="one-time-code"
            required
          />
          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              disabled={loading || !code || code.length !== 6}
              className="w-full bg-scars-red text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-scars-red focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full text-gray-500 py-2 px-4 rounded-lg font-medium hover:text-gray-700 focus:outline-none transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>Didn't receive the code? Check your spam folder or try resending.</p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification; 