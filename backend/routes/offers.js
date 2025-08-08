import express from 'express';
import { body, validationResult } from 'express-validator';
import Offer from '../models/Offer.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get current active offer
// @route   GET /api/offers/current
// @access  Public
router.get('/current', async (req, res) => {
  try {
    const offer = await Offer.getCurrentOffer();
    
    if (!offer) {
      return res.json({
        success: true,
        offer: null,
        message: 'No active offer found'
      });
    }

    res.json({
      success: true,
      offer: {
        _id: offer._id,
        title: offer.title,
        discount: offer.discount,
        description: offer.description,
        validFrom: offer.validFrom,
        validUntil: offer.validUntil,
        showBadge: offer.showBadge,
        badgeText: offer.badgeText,
        ctaText: offer.ctaText,
        ctaLink: offer.ctaLink,
        terms: offer.terms,
        delay: offer.delay,
        showOncePerSession: offer.showOncePerSession,
        isActive: offer.isActive,
        isValid: offer.isValid
      }
    });
  } catch (error) {
    console.error('Get current offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all offers (Admin)
// @route   GET /api/offers
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: offers.length,
      offers
    });
  } catch (error) {
    console.error('Get all offers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get offer by ID (Admin)
// @route   GET /api/offers/:id
// @access  Private/Admin
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    res.json({
      success: true,
      offer
    });
  } catch (error) {
    console.error('Get offer by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new offer (Admin)
// @route   POST /api/offers
// @access  Private/Admin
router.post('/', protect, authorize('admin'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('discount').notEmpty().withMessage('Discount text is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('validFrom').custom((value) => {
    if (!value) {
      throw new Error('Valid from date is required');
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error('Valid from date must be a valid date');
    }
    return true;
  }),
  body('validUntil').custom((value) => {
    if (!value) {
      throw new Error('Valid until date is required');
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error('Valid until date must be a valid date');
    }
    return true;
  }),
  body('ctaText').notEmpty().withMessage('CTA text is required'),
  body('ctaLink').notEmpty().withMessage('CTA link is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Convert date strings to Date objects
    const offerData = {
      ...req.body,
      validFrom: new Date(req.body.validFrom),
      validUntil: new Date(req.body.validUntil)
    };

    const offer = await Offer.create(offerData);

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      offer
    });
  } catch (error) {
    console.error('Create offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update offer (Admin)
// @route   PUT /api/offers/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('discount').notEmpty().withMessage('Discount text is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('validFrom').custom((value) => {
    if (!value) {
      throw new Error('Valid from date is required');
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error('Valid from date must be a valid date');
    }
    return true;
  }),
  body('validUntil').custom((value) => {
    if (!value) {
      throw new Error('Valid until date is required');
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error('Valid until date must be a valid date');
    }
    return true;
  }),
  body('ctaText').notEmpty().withMessage('CTA text is required'),
  body('ctaLink').notEmpty().withMessage('CTA link is required')
], async (req, res) => {
  console.log('Update offer request:', { id: req.params.id, body: req.body }); // Debug log
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array()); // Debug log
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Convert date strings to Date objects
    const updateData = {
      ...req.body,
      validFrom: new Date(req.body.validFrom),
      validUntil: new Date(req.body.validUntil)
    };

    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!offer) {
      console.log('Offer not found with ID:', req.params.id); // Debug log
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    console.log('Offer updated successfully:', offer._id); // Debug log
    res.json({
      success: true,
      message: 'Offer updated successfully',
      offer
    });
  } catch (error) {
    console.error('Update offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete offer (Admin)
// @route   DELETE /api/offers/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    res.json({
      success: true,
      message: 'Offer deleted successfully'
    });
  } catch (error) {
    console.error('Delete offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router; 