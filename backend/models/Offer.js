import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  // Offer Details
  title: {
    type: String,
    required: [true, 'Offer title is required'],
    trim: true
  },
  discount: {
    type: String,
    required: [true, 'Discount text is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Offer description is required'],
    trim: true
  },
  
  // Date Range
  validFrom: {
    type: Date,
    required: [true, 'Valid from date is required']
  },
  validUntil: {
    type: Date,
    required: [true, 'Valid until date is required']
  },
  
  // Display Settings
  showBadge: {
    type: Boolean,
    default: true
  },
  badgeText: {
    type: String,
    default: 'LIMITED TIME OFFER',
    trim: true
  },
  
  // Call to Action
  ctaText: {
    type: String,
    required: [true, 'CTA text is required'],
    trim: true
  },
  ctaLink: {
    type: String,
    required: [true, 'CTA link is required'],
    trim: true
  },
  
  // Terms
  terms: {
    type: String,
    default: '*Offer valid on selected items. Cannot be combined with other promotions.',
    trim: true
  },
  
  // Display Settings
  delay: {
    type: Number,
    default: 2000,
    min: [0, 'Delay cannot be negative']
  },
  showOncePerSession: {
    type: Boolean,
    default: true
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if offer is currently valid
offerSchema.virtual('isValid').get(function() {
  const now = new Date();
  return this.isActive && now >= this.validFrom && now <= this.validUntil;
});

// Method to get current active offer
offerSchema.statics.getCurrentOffer = function() {
  const now = new Date();
  return this.findOne({
    isActive: true,
    validFrom: { $lte: now },
    validUntil: { $gte: now }
  }).sort({ createdAt: -1 });
};

// Method to format date for display
offerSchema.methods.formatDate = function(dateField) {
  const date = this[dateField];
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const Offer = mongoose.model('Offer', offerSchema);

export default Offer; 