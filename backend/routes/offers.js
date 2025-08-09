import express from 'express';
import { body, validationResult } from 'express-validator';
import Offer from '../models/Offer.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

const sanitizeOfferPayload = (payload) => ({
  title: payload.title,
  discount: payload.discount,
  description: payload.description,
  validFrom: new Date(payload.validFrom),
  validUntil: new Date(payload.validUntil),
  showBadge: Boolean(payload.showBadge),
  badgeText: payload.badgeText ?? 'LIMITED TIME OFFER',
  ctaText: payload.ctaText,
  ctaLink: payload.ctaLink,
  terms: payload.terms ?? '*Offer valid on selected items. Cannot be combined with other promotions.',
  delay: Number(payload.delay ?? 2000),
  showOncePerSession: Boolean(payload.showOncePerSession),
  isActive: Boolean(payload.isActive)
});

const dateOrderValidator = [
  body('validFrom').custom((value, { req }) => {
    const from = new Date(value);
    if (isNaN(from.getTime())) throw new Error('Valid from date must be a valid date');
    return true;
  }),
  body('validUntil').custom((value, { req }) => {
    const until = new Date(value);
    if (isNaN(until.getTime())) throw new Error('Valid until date must be a valid date');
    const from = new Date(req.body.validFrom);
    if (!isNaN(from.getTime()) && until < from) {
      throw new Error('Valid until must be after valid from');
    }
    return true;
  }),
  body('delay').optional().isInt({ min: 0 }).withMessage('Delay must be a non-negative integer')
];

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
  body('ctaText').notEmpty().withMessage('CTA text is required'),
  body('ctaLink').notEmpty().withMessage('CTA link is required'),
  ...dateOrderValidator,
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const offerData = sanitizeOfferPayload(req.body);
    const offer = await Offer.create(offerData);

    res.status(201).json({ success: true, message: 'Offer created successfully', offer });
  } catch (error) {
    console.error('Create offer error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Update offer (Admin)
// @route   PUT /api/offers/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('discount').notEmpty().withMessage('Discount text is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('ctaText').notEmpty().withMessage('CTA text is required'),
  body('ctaLink').notEmpty().withMessage('CTA link is required'),
  ...dateOrderValidator,
], async (req, res) => {
  console.log('Update offer request:', { id: req.params.id, body: req.body });
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const updateData = sanitizeOfferPayload(req.body);

    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!offer) {
      console.log('Offer not found with ID:', req.params.id);
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    console.log('Offer updated successfully:', offer._id);
    res.json({ success: true, message: 'Offer updated successfully', offer });
  } catch (error) {
    console.error('Update offer error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
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