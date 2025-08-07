import express from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// @desc    Get all products with filtering and pagination
// @route   GET /api/products
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.brand) {
      filter.brand = { $regex: req.query.brand, $options: 'i' };
    }
    
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }
    
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }
    
    if (req.query.featured === 'true') {
      filter.isFeatured = true;
    }
    
    if (req.query.newArrival === 'true') {
      filter.isNewArrival = true;
    }
    
    if (req.query.bestSeller === 'true') {
      filter.isBestSeller = true;
    }

    // Build sort object
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-low':
          sort = { price: 1 };
          break;
        case 'price-high':
          sort = { price: -1 };
          break;
        case 'rating':
          sort = { ratings: -1 };
          break;
        case 'name':
          sort = { name: 1 };
          break;
      }
    }

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      count: products.length,
      total,
      totalPages,
      currentPage: page,
      products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8);

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get new arrivals
router.get('/new-arrivals', async (req, res) => {
  try {
    const products = await Product.find({ isNewArrival: true });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch new arrivals' });
  }
});

// Get best sellers
router.get('/best-sellers', async (req, res) => {
  try {
    const products = await Product.find({ isBestSeller: true });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch best sellers' });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, authorize('admin'), upload.array('images', 5), [
  body('name').notEmpty().withMessage('Product name is required'),
  body('description').notEmpty().withMessage('Product description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('category').isIn(['topwear', 'bottomwear']).withMessage('Valid category is required'),
  body('brand').notEmpty().withMessage('Brand is required'),
  body('material').notEmpty().withMessage('Material is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Handle image uploads
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file =>
        cloudinary.uploader.upload_stream({ folder: 'products' }, (error, result) => {
          if (error) throw error;
          return {
            url: result.secure_url,
            altText: req.body.name || 'Product image'
          };
        })
      );
      // Wait for all uploads to finish
      images = await Promise.all(
        req.files.map(
          file => new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: 'products' }, (error, result) => {
              if (error) return reject(error);
              resolve({ url: result.secure_url, altText: req.body.name || 'Product image' });
            });
            stream.end(file.buffer);
          })
        )
      );
    }

    // Process size-specific stock
    const stockData = {};
    const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    
    availableSizes.forEach(size => {
      const stockKey = `stock_${size}`;
      stockData[size] = parseInt(req.body[stockKey]) || 0;
    });

    // Automatically set sizes based on which sizes have stock
    const sizesWithStock = availableSizes.filter(size => stockData[size] > 0);

    const productData = { 
      ...req.body,
      stock: stockData,
      sizes: sizesWithStock
    };
    
    if (images.length > 0) productData.images = images;

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Process size-specific stock for updates
    const stockData = {};
    const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    
    availableSizes.forEach(size => {
      const stockKey = `stock_${size}`;
      stockData[size] = parseInt(req.body[stockKey]) || 0;
    });

    // Automatically set sizes based on which sizes have stock
    const sizesWithStock = availableSizes.filter(size => stockData[size] > 0);

    const updateData = {
      ...req.body,
      stock: stockData,
      sizes: sizesWithStock
    };

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create/Update product review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').notEmpty().withMessage('Comment is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const { rating, comment } = req.body;

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'Product already reviewed'
      });
    }

    const review = {
      user: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment
    };

    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update product stock (for testing)
// @route   PATCH /api/products/:id/stock
// @access  Public (for testing)
router.patch('/:id/stock', [
  body('stock').isInt({ min: 0 }).withMessage('Valid stock quantity is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.stock = req.body.stock;
    await product.save();

    res.json({
      success: true,
      message: 'Stock updated successfully',
      product: {
        name: product.name,
        stock: product.stock
      }
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router; 