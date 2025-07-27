# 🚀 Gym E-commerce Application - Client Handover Guide

## 📋 Overview
This is a complete MERN stack e-commerce application for gym wear with admin dashboard, user authentication, payment processing, and order management.

## 🌐 Live URLs
- **Frontend (Vercel):** https://gym-ecom-2o9mkirty-abhijith-mss-projects.vercel.app
- **Backend (Railway):** https://gym-backend-production-041a.up.railway.app

## 🔐 Admin Access Options

### Option A: Use Existing Admin Account (Quick Start)
**Current Admin Credentials:**
- Email: `admin@gym.com`
- Password: `admin123`

**Steps:**
1. Go to the frontend URL
2. Click "Login" 
3. Use the credentials above
4. You'll be redirected to the admin dashboard
5. Create your own admin account from the admin panel
6. Delete or change the password of the default admin account

### Option B: Create Your Own Admin Account (More Secure)
**Method 1: Using the API Endpoint**
```bash
curl -X POST https://gym-backend-production-041a.up.railway.app/api/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "your-email@example.com",
    "password": "your-secure-password"
  }'
```

**Method 2: Using the Seed Script**
Visit: `https://gym-backend-production-041a.up.railway.app/api/seed`
This will create fresh admin and user accounts.

## 🔧 Environment Variables Setup

### Frontend (Vercel)
Set these in your Vercel project settings:
```
VITE_API_URL=https://gym-backend-production-041a.up.railway.app/api
```

### Backend (Railway)
Set these in your Railway project settings:

**Required:**
```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

**Optional (for full functionality):**
```
# Email Service (Mailgun)
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
MAILGUN_FROM_EMAIL=noreply@yourdomain.com

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Image Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 📱 Features Included

### User Features
- ✅ User registration and login
- ✅ Email and phone verification
- ✅ Product browsing and search
- ✅ Shopping cart functionality
- ✅ Secure checkout with Razorpay
- ✅ Order tracking
- ✅ User profile management
- ✅ Address management

### Admin Features
- ✅ Product management (CRUD)
- ✅ Order management
- ✅ User management
- ✅ Stock management
- ✅ Image upload with Cloudinary
- ✅ Sales analytics

### Technical Features
- ✅ Responsive design (mobile-first)
- ✅ JWT authentication
- ✅ Input validation
- ✅ Error handling
- ✅ Rate limiting
- ✅ Security headers
- ✅ CORS configuration

## 🛠️ Customization Guide

### Branding
1. **Logo:** Replace `frontend/src/assets/scars.png` with your logo
2. **Colors:** Update CSS variables in `frontend/src/index.css`
3. **Company Name:** Update "SCARS" references throughout the codebase

### Products
1. **Categories:** Currently supports "topwear" and "bottomwear"
2. **Sizes:** Configurable in product creation
3. **Colors:** Dynamic color management with hex codes

### Payment
- Currently integrated with Razorpay (Indian payment gateway)
- Can be easily replaced with Stripe, PayPal, etc.

## 🔒 Security Considerations

### Before Going Live
1. **Change default admin password** or create new admin account
2. **Update JWT secret** to a strong, unique value
3. **Set up proper email/SMS services** for verification
4. **Configure payment gateway** with production credentials
5. **Set up monitoring** and error tracking
6. **Enable HTTPS** (already configured on Vercel/Railway)

### Regular Maintenance
1. **Monitor logs** for errors
2. **Update dependencies** regularly
3. **Backup database** regularly
4. **Monitor payment transactions**
5. **Check for security updates**

## 📞 Support & Maintenance

### Immediate Actions Required
1. **Set up your admin account** (choose Option A or B above)
2. **Configure environment variables** in Railway
3. **Test all user flows** (registration, login, checkout)
4. **Update branding** (logo, colors, company name)

### Optional Enhancements
1. **Add analytics** (Google Analytics, etc.)
2. **Set up email marketing** integration
3. **Add more payment gateways**
4. **Implement inventory alerts**
5. **Add customer support chat**

## 🚨 Important Notes

1. **Database:** Currently using MongoDB Atlas - ensure you have access
2. **Payments:** Test mode enabled - switch to production for live payments
3. **Email/SMS:** Currently in fallback mode - configure for full functionality
4. **Images:** Using Cloudinary - ensure you have proper storage plan

### 📱 SMS OTP Fallback System
- **Current Status:** SMS service (Twilio) is not configured in production
- **Fallback:** System automatically provides test OTP `123456` for all phone numbers
- **User Experience:** Users can still verify their phone numbers during signup
- **To Enable Real SMS:** Configure Twilio credentials in Railway environment variables

## 📚 API Documentation

### Key Endpoints
- `GET /api/health` - Server health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - Get all products
- `POST /api/orders` - Create order
- `POST /api/create-admin` - Create admin user

### Authentication
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 🎯 Next Steps

1. **Immediate:** Set up admin account and test functionality
2. **Short-term:** Configure environment variables and branding
3. **Medium-term:** Set up monitoring and analytics
4. **Long-term:** Plan for scaling and additional features

---

**Need Help?** 
- Check the console logs for detailed error messages
- Monitor Railway logs for backend issues
- Test API endpoints directly using tools like Postman
- Review the codebase comments for implementation details

**Good Luck with Your E-commerce Business! 🚀** 