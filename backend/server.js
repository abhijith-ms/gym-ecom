import './loadEnv.js';

// Only log non-sensitive config presence in development
if (process.env.NODE_ENV === 'development') {
  console.log('Twilio config present:', {
    hasAccountSid: Boolean(process.env.TWILIO_ACCOUNT_SID),
    hasAuthToken: Boolean(process.env.TWILIO_AUTH_TOKEN),
    hasPhoneNumber: Boolean(process.env.TWILIO_PHONE_NUMBER)
  });
}

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import Razorpay from 'razorpay';

// Import models
import User from './models/User.js';

// Import routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js';
import userRoutes from './routes/users.js';
import smsRoutes from './routes/sms.js';
import offerRoutes from './routes/offers.js';

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

const allowedOrigins = [
  'http://localhost:5173',
  'https://gym-ecom.vercel.app',
  /^https:\/\/gym-ecom-.*\.vercel\.app$/, // Wildcard for preview URLs
  'https://gym-ecom-git-main-abhijith-mss-projects.vercel.app',
  'https://gym-ecom-kmg59nnfg-abhijith-mss-projects.vercel.app',
  'https://gym-ecom-g7n25n0p7-abhijith-mss-projects.vercel.app',
  'https://gym-ecom-ittmmu26j-abhijith-mss-projects.vercel.app',
  'https://gym-ecom-aeol07lp9-abhijith-mss-projects.vercel.app',
  'https://gym-ecom-f77xp1meh-abhijith-mss-projects.vercel.app',
  // Production domains
  'https://scars-india.com',
  'https://www.scars-india.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gym-ecommerce')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/offers', offerRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Gym Ecommerce API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      payments: '/api/payments',
      users: '/api/users',
      sms: '/api/sms'
    }
  });
});

// Development-only utilities
if (process.env.NODE_ENV === 'development') {
  // Seed database route (for development/testing)
  app.get('/api/seed', async (req, res) => {
    try {
      const { exec } = await import('child_process');
      exec('npm run seed', (error, stdout, stderr) => {
        if (error) {
          console.error('Seed error:', error);
          return res.status(500).json({
            success: false,
            message: 'Failed to seed database',
            error: error.message
          });
        }
        console.log('Seed output:', stdout);
        res.json({
          success: true,
          message: 'Database seeded successfully',
          output: stdout
        });
      });
    } catch (error) {
      console.error('Seed route error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  // Create admin user route (for development/testing)
  app.post('/api/create-admin', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      // Create admin user
      const adminUser = await User.create({
        name,
        email,
        password,
        role: 'admin',
        phone: '9876543210',
        address: {
          street: 'Admin Address',
          city: 'Admin City',
          state: 'Admin State',
          zipCode: '12345',
          country: 'Admin Country'
        }
      });

      res.status(201).json({
        success: true,
        message: 'Admin user created successfully',
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role
        }
      });
    } catch (error) {
      console.error('Create admin error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Razorpay initialization moved to payment routes
if (process.env.NODE_ENV === 'development') {
  console.log('RAZORPAY_KEY_ID present:', Boolean(process.env.RAZORPAY_KEY_ID));
} 