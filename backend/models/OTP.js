import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    index: true
  },
  otp: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['phone_verification', 'login', 'password_reset'],
    default: 'phone_verification'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Not required for initial phone verification
  },
  verified: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // OTP expires after 10 minutes
  }
});

// Index for efficient queries
otpSchema.index({ phoneNumber: 1, createdAt: -1 });
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

// Method to check if OTP is valid
otpSchema.methods.isValid = function() {
  const now = new Date();
  const createdAt = new Date(this.createdAt);
  const diffInMinutes = (now - createdAt) / (1000 * 60);
  
  return !this.verified && this.attempts < 3 && diffInMinutes <= 10;
};

// Method to verify OTP
otpSchema.methods.verify = function(inputOtp) {
  if (!this.isValid()) {
    return { success: false, message: 'OTP has expired or exceeded maximum attempts' };
  }
  
  this.attempts += 1;
  
  if (this.otp === inputOtp) {
    this.verified = true;
    return { success: true, message: 'OTP verified successfully' };
  } else {
    return { success: false, message: 'Invalid OTP' };
  }
};

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
