import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Offer from './models/Offer.js';

dotenv.config();

const seedOffer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if offer already exists
    const existingOffer = await Offer.findOne();
    if (existingOffer) {
      console.log('Offer already exists, skipping seed');
      return;
    }

    // Create default offer
    const defaultOffer = {
      title: "🎉 FLASH SALE! 🎉",
      discount: "UP TO 40% OFF",
      description: "On all men's gym topwear & bottomwear",
      validFrom: new Date('2025-01-01'),
      validUntil: new Date('2025-12-31'),
      showBadge: true,
      badgeText: "LIMITED TIME OFFER",
      ctaText: "SHOP NOW",
      ctaLink: "/collections",
      terms: "*Offer valid on selected items. Cannot be combined with other promotions.",
      delay: 2000,
      showOncePerSession: true,
      isActive: true
    };

    const offer = await Offer.create(defaultOffer);
    console.log('Default offer created:', offer.title);

    console.log('Offer seeding completed successfully');
  } catch (error) {
    console.error('Error seeding offer:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedOffer(); 