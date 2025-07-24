import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/useStore';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState(null);
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(data);
      if (response.data.success) {
        login(response.data.user, response.data.token);
        toast.success('Login successful!');
        
        // Redirect admin users to admin dashboard, regular users to home
        if (response.data.user.role === 'admin') {
          navigate('/admin/products');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-scars-red hover:text-red-700"
            >
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                {...register('email', { 
                  required: 'Email or phone is required',
                  validate: value => {
                    // Accept either email or 10-digit phone number
                    if (value.includes('@')) {
                      // Basic email regex
                      return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) || 'Please enter a valid email address';
                    } else {
                      return (/^[6-9]\d{9}$/).test(value.replace(/\D/g, '')) || 'Please enter a valid 10-digit Indian mobile number';
                    }
                  }
                })}
                id="email"
                name="email"
                type="text"
                autoComplete="username"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-scars-red' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Enter your email or phone number"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-scars-red">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-scars-red' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-scars-red">{errors.password.message}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button
              type="button"
              className="text-xs text-scars-red hover:underline focus:outline-none"
              onClick={() => { setForgotOpen(true); setForgotMsg(null); setForgotEmail(''); }}
            >
              Forgot password?
            </button>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-scars-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-scars-red disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        {/* Forgot Password Modal */}
        {forgotOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-xs p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                onClick={() => setForgotOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
              <h3 className="text-lg font-bold mb-2">Reset Password</h3>
              <form
                onSubmit={async e => {
                  e.preventDefault();
                  setForgotLoading(true);
                  setForgotMsg(null);
                  try {
                    const res = await authAPI.forgotPassword({ email: forgotEmail });
                    setForgotMsg(res.data.message || 'Check your email for a new password.');
                  } catch (err) {
                    setForgotMsg(err.response?.data?.message || 'Failed to reset password.');
                  } finally {
                    setForgotLoading(false);
                  }
                }}
                className="space-y-3"
              >
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="border rounded px-3 py-2 w-full"
                />
                {forgotMsg && <div className={`text-sm ${forgotMsg.includes('sent') ? 'text-green-600' : 'text-scars-red'}`}>{forgotMsg}</div>}
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-scars-red text-white py-2 rounded hover:bg-red-700 transition disabled:opacity-60"
                >
                  {forgotLoading ? 'Sending...' : 'Send Reset Email'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login; 