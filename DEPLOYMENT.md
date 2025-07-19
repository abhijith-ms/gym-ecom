# 🚀 Deployment Guide - MERN Ecommerce App

## 📋 Prerequisites
- GitHub account
- Render account (free)
- MongoDB Atlas account (free)
- Razorpay account
- Gmail account (for SMTP)
- Cloudinary account

## 🎯 Quick Deployment Steps

### 1. **MongoDB Atlas Setup**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Replace `username`, `password`, and `cluster` in the connection string

### 2. **Render Deployment**

#### Option A: Using Render Dashboard
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure backend:
   - **Name**: `gym-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   GMAIL_USER=your_gmail@gmail.com
   GMAIL_PASS=your_gmail_app_password
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

6. Deploy frontend:
   - **New +** → **Static Site**
   - **Name**: `gym-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Environment Variable**: `VITE_API_URL=https://your-backend-url.onrender.com`

#### Option B: Using render.yaml (Recommended)
1. Update `render.yaml` with your environment variables
2. Push to GitHub
3. Connect repo to Render
4. Render will auto-deploy both services

### 3. **Environment Variables Setup**

#### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gym-ecom
JWT_SECRET=your-super-secret-jwt-key-here
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

### 4. **Domain Setup (Optional)**
1. Buy domain from Namecheap/GoDaddy
2. In Render dashboard, go to your service
3. Click "Settings" → "Custom Domains"
4. Add your domain and configure DNS

## 🔧 Alternative Hosting Options

### **Vercel + Railway**
- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Railway
- **Database**: MongoDB Atlas

### **Netlify + Heroku**
- **Frontend**: Deploy to Netlify
- **Backend**: Deploy to Heroku
- **Database**: MongoDB Atlas

## 🧪 Testing After Deployment

1. **Test Backend API**:
   ```bash
   curl https://your-backend-url.onrender.com/api/health
   ```

2. **Test Frontend**:
   - Visit your frontend URL
   - Test registration/login
   - Test product browsing
   - Test cart functionality

3. **Test Payment**:
   - Use Razorpay test cards
   - Test complete order flow

## 🚨 Common Issues & Solutions

### **CORS Error**
- Ensure frontend URL is in backend CORS configuration
- Check environment variables are set correctly

### **MongoDB Connection Error**
- Verify connection string
- Check IP whitelist in MongoDB Atlas
- Ensure username/password are correct

### **Build Failures**
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check for syntax errors

### **Payment Issues**
- Verify Razorpay keys are correct
- Check webhook URLs in Razorpay dashboard
- Test with Razorpay test mode first

## 📞 Support
- Check Render logs for detailed error messages
- Verify all environment variables are set
- Test locally before deploying

## 🔒 Security Checklist
- [ ] JWT_SECRET is strong and unique
- [ ] MongoDB connection uses authentication
- [ ] Environment variables are not in code
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] HTTPS is enabled (automatic on Render)

## 🎉 Success!
Your MERN ecommerce app is now live! 🚀 