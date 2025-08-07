import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide product description']
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    enum: ['topwear', 'bottomwear']
  },
  brand: {
    type: String,
    required: [true, 'Please provide product brand']
  },
  material: {
    type: String,
    required: [true, 'Please provide product material']
  },
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
  }],
  colors: [{
    name: String,
    code: String
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    altText: String
  }],
  stock: {
    XS: { type: Number, default: 0, min: [0, 'Stock cannot be negative'] },
    S: { type: Number, default: 0, min: [0, 'Stock cannot be negative'] },
    M: { type: Number, default: 0, min: [0, 'Stock cannot be negative'] },
    L: { type: Number, default: 0, min: [0, 'Stock cannot be negative'] },
    XL: { type: Number, default: 0, min: [0, 'Stock cannot be negative'] },
    XXL: { type: Number, default: 0, min: [0, 'Stock cannot be negative'] },
    XXXL: { type: Number, default: 0, min: [0, 'Stock cannot be negative'] }
  },
  ratings: {
    type: Number,
    default: 0
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  reviews: [reviewSchema],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  tags: [String],
  specifications: {
    type: Map,
    of: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search functionality
productSchema.index({ name: 'text', description: 'text', brand: 'text' });

// Virtual for total stock
productSchema.virtual('totalStock').get(function() {
  return Object.values(this.stock).reduce((total, quantity) => total + quantity, 0);
});

// Method to check if a specific size is in stock
productSchema.methods.isSizeInStock = function(size, quantity = 1) {
  return this.stock[size] >= quantity;
};

// Method to get available sizes (sizes with stock > 0)
productSchema.methods.getAvailableSizes = function() {
  return this.sizes.filter(size => this.stock[size] > 0);
};

export default mongoose.model('Product', productSchema); 