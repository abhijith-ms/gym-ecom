# Gym Ecommerce App - MERN Stack with Razorpay

A complete ecommerce application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring Razorpay payment integration, user authentication, product management, and order processing.

## 🚀 Features

### Frontend (React)
- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- **User Authentication**: Login/Register with JWT tokens
- **Product Catalog**: Browse products with filtering and search
- **Shopping Cart**: Add/remove items with quantity management
- **User Profile**: Manage personal information and view order history
- **Real-time Updates**: Live cart updates and notifications
- **Responsive Design**: Works perfectly on all devices

### Backend (Node.js/Express)
- **RESTful API**: Complete CRUD operations for all entities
- **Authentication & Authorization**: JWT-based auth with role-based access
- **Product Management**: Full product lifecycle with categories, reviews
- **Order Processing**: Complete order management with status tracking
- **Payment Integration**: Razorpay payment gateway with webhook support
- **File Upload**: Image upload for products
- **Search & Filtering**: Advanced product search and filtering
- **Admin Panel**: Comprehensive admin dashboard

### Database (MongoDB)
- **User Management**: User profiles, authentication, roles
- **Product Catalog**: Products with categories, variants, reviews
- **Order System**: Complete order tracking and management
- **Payment Records**: Payment history and transaction tracking

## Tech Stack

### Frontend
- **React 19** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Razorpay** - Payment gateway
- **Express Validator** - Input validation
- **Multer** - File uploads
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Razorpay account and API keys

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file:
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

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  role: String (user/admin),
  avatar: String,
  isEmailVerified: Boolean
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  category: String,
  brand: String,
  material: String,
  sizes: [String],
  colors: [{ name: String, code: String }],
  images: [{ url: String, altText: String }],
  stock: Number,
  ratings: Number,
  reviews: [ReviewSchema],
  isFeatured: Boolean,
  isNewArrival: Boolean,
  isBestSeller: Boolean
}
```

### Order Model
```javascript
{
  user: ObjectId (ref: User),
  orderItems: [OrderItemSchema],
  shippingAddress: AddressSchema,
  paymentMethod: String,
  paymentResult: Object,
  itemsPrice: Number,
  taxPrice: Number,
  shippingPrice: Number,
  totalPrice: Number,
  isPaid: Boolean,
  isDelivered: Boolean,
  status: String,
  razorpayOrderId: String,
  razorpayPaymentId: String
}
```

## Authentication

The app uses JWT (JSON Web Tokens) for authentication:

- **Registration**: Users can create accounts with email verification
- **Login**: Secure login with password hashing
- **Protected Routes**: Role-based access control
- **Token Management**: Automatic token refresh and logout

## Payment Integration

### Razorpay Features
- **Payment Processing**: Credit cards, debit cards, UPI, net banking
- **Order Creation**: Server-side order creation
- **Payment Verification**: Signature verification for security
- **Webhook Support**: Real-time payment status updates
- **Refund Support**: Automated refund processing
- **Multiple Currencies**: Support for INR and USD

### Payment Flow
1. User adds items to cart
2. Proceeds to checkout
3. Creates order in backend
4. Creates Razorpay order
5. User completes payment
6. Payment verification
7. Order confirmation

## Shopping Features

### Product Management
- **Categories**: Men, Women, Unisex, Accessories, Shoes
- **Filtering**: By category, brand, price range, size, color
- **Search**: Full-text search across product names and descriptions
- **Sorting**: By price, rating, name, newest
- **Pagination**: Efficient product loading

### Cart System
- **Add/Remove Items**: Easy cart management
- **Quantity Control**: Update quantities in real-time
- **Size/Color Selection**: Multiple variants support
- **Persistent Cart**: Cart saved in localStorage
- **Price Calculation**: Automatic total calculation

### Order Management
- **Order Creation**: Complete order processing
- **Status Tracking**: Pending, Processing, Shipped, Delivered
- **Order History**: View all past orders
- **Order Cancellation**: Cancel orders within time limits
- **Email Notifications**: Order status updates

## Admin Features

### Product Management
- **Add Products**: Complete product creation with images
- **Edit Products**: Update product information
- **Delete Products**: Remove products from catalog
- **Stock Management**: Track and update inventory
- **Category Management**: Organize products by category

### Order Management
- **View All Orders**: Complete order overview
- **Update Status**: Change order status
- **Process Payments**: Handle payment confirmations
- **Shipping Management**: Track deliveries

### User Management
- **User List**: View all registered users
- **User Details**: Access user information
- **Role Management**: Assign admin roles
- **User Statistics**: Analytics and insights

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Add review

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/pay` - Update payment status
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `POST /api/payments/webhook` - Razorpay webhook

## Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to Heroku, Vercel, or AWS
4. Set up Razorpay webhook URL

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to Vercel, Netlify, or AWS S3
3. Configure environment variables
4. Update API URL in production

## Sample Data

The seed script creates:
- **Admin User**: `admin@gym.com` / `admin123`
- **Regular User**: `john@gym.com` / `user123`
- **8 Sample Products**: Across different categories

## Development

### Available Scripts

**Backend:**
- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Environment Variables

**Backend (.env):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gym-ecommerce
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Future Enhancements

- [ ] Email notifications
- [ ] SMS notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Advanced search filters
- [ ] Wishlist functionality
- [ ] Social media integration
- [ ] Affiliate program
- [ ] Loyalty points system

---

**Built with ❤️ using the MERN stack** 