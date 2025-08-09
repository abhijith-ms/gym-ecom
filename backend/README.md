# Gym Ecommerce Backend

A complete MERN stack ecommerce backend with Razorpay payment integration, built with Node.js, Express, and MongoDB.

## Features

- 🔐 **Authentication & Authorization**: JWT-based authentication with role-based access control
- 🛍️ **Product Management**: CRUD operations for products with categories, filtering, and search
- 📦 **Order Management**: Complete order lifecycle with status tracking
- 💳 **Payment Integration**: Razorpay payment gateway with webhook support
- 👥 **User Management**: User profiles, admin panel, and user statistics
- 🔍 **Advanced Search**: Text search, filtering by category, price, brand, etc.
- ⭐ **Reviews & Ratings**: Product review system with ratings
- 📊 **Admin Dashboard**: Comprehensive admin panel for managing the store

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Razorpay
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Razorpay account and API keys

## Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/gym-ecommerce
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret
   FRONTEND_URL=http://localhost:5173
   ```

4. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products (with filtering & pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `POST /api/products/:id/reviews` - Add product review
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new-arrivals` - Get new arrivals
- `GET /api/products/best-sellers` - Get best sellers

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/myorders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Update order to paid
- `PUT /api/orders/:id/deliver` - Mark order as delivered (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders` - Get all orders (Admin)

### Payments (Razorpay)
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment signature
- `GET /api/payments/:paymentId` - Get payment details
- `POST /api/payments/:paymentId/refund` - Process refund
- `GET /api/payments/:paymentId/refunds` - Get refund details
- `POST /api/payments/webhook` - Razorpay webhook handler
- `GET /api/payments/methods` - Get available payment methods

### Users (Admin)
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)
- `GET /api/users/stats/overview` - Get user statistics (Admin)

## Database Models

### User
- Basic info (name, email, phone)
- Address information
- Role-based access (user/admin)
- Password (hashed)
- Profile management

### Product
- Product details (name, description, price)
- Categories and brands
- Sizes and colors
- Stock management
- Images and tags
- Reviews and ratings
- Featured flags

### Order
- Order items with product details
- Shipping address
- Payment information
- Order status tracking
- Price calculations (items, tax, shipping)

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: Express-validator for request validation
- **CORS Protection**: Configured CORS for frontend integration
- **Rate Limiting**: API rate limiting to prevent abuse
- **Helmet**: Security headers for Express
- **Payment Verification**: Razorpay signature verification

## Payment Integration

The backend integrates with Razorpay for payment processing:

1. **Order Creation**: Creates Razorpay orders for payment
2. **Payment Verification**: Verifies payment signatures for security
3. **Webhook Handling**: Processes payment events from Razorpay
4. **Refund Support**: Handles payment refunds
5. **Multiple Payment Methods**: Supports various payment options

## Error Handling

- Comprehensive error handling with meaningful messages
- Validation errors with detailed feedback
- Database error handling
- Payment error handling
- Proper HTTP status codes

## Development

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

### Environment Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRE` - JWT expiration time
- `RAZORPAY_KEY_ID` - Razorpay public key
- `RAZORPAY_KEY_SECRET` - Razorpay secret key
- `FRONTEND_URL` - Frontend URL for CORS

## Sample Data

The seed script creates:
- Admin user: `admin@gym.com` / `admin123`
- Regular user: `john@gym.com` / `user123`
- 8 sample products across different categories

## API Response Format

All API responses follow a consistent format:

```json
{
  "success": true/false,
  "message": "Response message",
  "data": {}, // Response data
  "errors": [] // Validation errors (if any)
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 

# Backend Deployment Notes

## Environment Variables

Create a `.env` with:

- NODE_ENV=production
- PORT=5000
- MONGODB_URI=
- JWT_SECRET=
- JWT_EXPIRES_IN=30d
- RAZORPAY_KEY_ID=
- RAZORPAY_KEY_SECRET=
- TWILIO_ACCOUNT_SID=
- TWILIO_AUTH_TOKEN=
- TWILIO_PHONE_NUMBER=
- SMTP_HOST=
- SMTP_PORT=
- SMTP_USER=
- SMTP_PASS=
- SMTP_FROM="Scars India <no-reply@scars-india.com>"

## CORS

Ensure `https://scars-india.com` and `https://www.scars-india.com` are included in allowed origins. You can also use `CORS_ALLOWED_ORIGINS` as a comma-separated list and parse it in `server.js` if you'd like a config-based approach.

## Security

- Ensure logs don’t print secrets in production (already enforced).
- Use strong JWT secret and rotate credentials.
- Limit admin utility routes to development (already enforced).

## Health and Monitoring

- Exposes `/api/health` for uptime checks.
- Add application monitoring (Sentry/Logtail) as needed. 