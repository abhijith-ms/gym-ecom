import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/useStore';
import PhoneVerification from '../components/Auth/PhoneVerification';
import smsAPI from '../services/smsAPI';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
};

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    if (showPhoneVerification) return;
    
    setIsLoading(true);
    clearErrors();
    
    try {
      const cleanPhone = data.phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
        setError('phone', {
          type: 'manual',
          message: 'Please enter a valid 10-digit Indian mobile number',
        });
        setIsLoading(false);
        return;
      }

      // Log registration attempt
      console.log('Attempting registration with phone:', cleanPhone);
      
      const response = await authAPI.register({
        ...data,
        phone: cleanPhone,
      });
      
      if (response.data.success) {
        console.log('Registration successful, sending OTP to:', `+91${cleanPhone}`);
        setRegisteredUser(response.data.user);
        const formattedPhone = `+91${cleanPhone}`;
        setPhoneNumber(formattedPhone);
        
        try {
          setIsVerifying(true);
          console.log('Calling smsAPI.sendOTP with:', formattedPhone);
          const otpResponse = await smsAPI.sendOTP(formattedPhone);
          console.log('OTP API Response:', otpResponse);
          
          if (otpResponse.success) {
            setShowPhoneVerification(true);
            toast.success('OTP sent to your phone number', {
              style: {
                background: '#f0fdf4',
                color: '#166534',
                border: '1px solid #bbf7d0',
              },
            });
          } else {
            throw new Error(otpResponse.message || 'Failed to send OTP');
          }
        } catch (error) {
          console.error('Error in OTP sending process:', {
            error: error.message,
            response: error.response?.data,
            status: error.response?.status,
            statusText: error.response?.statusText,
          });
          
          let errorMessage = 'Failed to send OTP. Please try again.';
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          toast.error(errorMessage, {
            style: {
              background: '#fef2f2',
              color: '#b91c1c',
              border: '1px solid #fecaca',
            },
          });
          setShowPhoneVerification(false);
        } finally {
          setIsVerifying(false);
        }
      }
    } catch (error) {
      console.error('Registration error:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => {
          setError(err.param, {
            type: 'server',
            message: err.msg,
          });
        });
      } else {
        toast.error(errorMessage, {
          style: {
            background: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSuccess = (verificationData) => {
    if (registeredUser) {
      login({
        ...registeredUser,
        isPhoneVerified: true,
      }, verificationData.token);
      
      toast.success('Phone number verified successfully!', {
        style: {
          background: '#f0fdf4',
          color: '#166534',
          border: '1px solid #bbf7d0',
        },
      });
      
      // Redirect to profile after a short delay
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    }
  };

  const handleResendOTP = async () => {
    if (!phoneNumber || isVerifying) return;
    
    try {
      setIsVerifying(true);
      await smsAPI.sendOTP(phoneNumber);
      toast.success('New OTP sent to your phone number', {
        style: {
          background: '#f0fdf4',
          color: '#166534',
          border: '1px solid #bbf7d0',
        },
      });
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error('Failed to resend OTP. Please try again.', {
        style: {
          background: '#fef2f2',
          color: '#b91c1c',
          border: '1px solid #fecaca',
        },
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // OTP Verification Screen
  if (showPhoneVerification && phoneNumber) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-2"
                variants={itemVariants}
              >
                Verify Your Phone
              </motion.h2>
              <motion.p 
                className="text-gray-600 text-sm"
                variants={itemVariants}
              >
                We've sent a verification code to <span className="font-medium text-scars-red">{phoneNumber}</span>
              </motion.p>
            </div>
            
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <PhoneVerification 
                phoneNumber={phoneNumber}
                onVerificationSuccess={handleVerificationSuccess}
                onResendOTP={handleResendOTP}
                isRequired={true}
                isVerifying={isVerifying}
              />
              
              <motion.div className="mt-6 text-center" variants={itemVariants}>
                <button
                  onClick={() => setShowPhoneVerification(false)}
                  className="text-sm font-medium text-scars-red hover:text-red-700 focus:outline-none transition-colors duration-200 flex items-center justify-center mx-auto"
                  disabled={isVerifying}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to registration
                </button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Registration Form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <motion.div 
        className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300"
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        <div className="p-8">
          <motion.div 
            className="text-center mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-3xl font-bold text-gray-900 mb-2"
              variants={itemVariants}
            >
              Create Account
            </motion.h1>
            <motion.p 
              className="text-gray-600 text-sm"
              variants={itemVariants}
            >
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-scars-red hover:text-red-700 transition-colors duration-200"
              >
                Sign in
              </Link>
            </motion.p>
          </motion.div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Name Field */}
              <motion.div variants={itemVariants}>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    className={`w-full px-4 py-2.5 rounded-lg border-2 focus:ring-2 focus:ring-offset-1 transition-all duration-200 ${
                      errors.name 
                        ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-scars-red/30 focus:border-scars-red'
                    }`}
                    {...register('name', { 
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters',
                      },
                    })}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                )}
              </motion.div>
              
              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`w-full px-4 py-2.5 rounded-lg border-2 focus:ring-2 focus:ring-offset-1 transition-all duration-200 ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-scars-red/30 focus:border-scars-red'
                  }`}
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address',
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </motion.div>
              
              {/* Phone Field */}
              <motion.div variants={itemVariants}>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">+91</span>
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={10}
                    className={`w-full pl-12 pr-4 py-2.5 rounded-lg border-2 focus:ring-2 focus:ring-offset-1 transition-all duration-200 ${
                      errors.phone 
                        ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-scars-red/30 focus:border-scars-red'
                    }`}
                    placeholder="9876543210"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: 'Please enter a valid 10-digit Indian mobile number',
                      },
                    })}
                    onChange={(e) => {
                      // Only allow digits and limit to 10 characters
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      e.target.value = value;
                    }}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                )}
              </motion.div>
              
              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  className={`w-full px-4 py-2.5 rounded-lg border-2 focus:ring-2 focus:ring-offset-1 transition-all duration-200 ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-scars-red/30 focus:border-scars-red'
                  }`}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                )}
              </motion.div>
              
              {/* Confirm Password Field */}
              <motion.div variants={itemVariants}>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className={`w-full px-4 py-2.5 rounded-lg border-2 focus:ring-2 focus:ring-offset-1 transition-all duration-200 ${
                    errors.confirmPassword 
                      ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-scars-red/30 focus:border-scars-red'
                  }`}
                  {...register('confirmPassword', {
                    validate: value => 
                      value === password || 'Passwords do not match',
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
                )}
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center ${
                  isLoading
                    ? 'bg-scars-red/80 cursor-not-allowed'
                    : 'bg-scars-red hover:bg-red-700 shadow-md hover:shadow-lg'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </motion.div>
          </form>
          
          <motion.div 
            className="mt-6 text-center text-sm text-gray-500"
            variants={itemVariants}
          >
            By creating an account, you agree to our{' '}
            <a href="/terms" className="text-scars-red hover:underline">Terms</a> and{' '}
            <a href="/privacy" className="text-scars-red hover:underline">Privacy Policy</a>.
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;