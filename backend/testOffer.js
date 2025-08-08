import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Offer from './models/Offer.js';

dotenv.config();

const testOffer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all offers
    const offers = await Offer.find();
    console.log('All offers:', offers.length);
    
    offers.forEach((offer, index) => {
      console.log(`Offer ${index + 1}:`, {
        _id: offer._id,
        title: offer.title,
        isActive: offer.isActive,
        validFrom: offer.validFrom,
        validUntil: offer.validUntil
      });
    });

    // Test getCurrentOffer method
    const currentOffer = await Offer.getCurrentOffer();
    console.log('Current offer:', currentOffer ? {
      _id: currentOffer._id,
      title: currentOffer.title,
      isActive: currentOffer.isActive
    } : 'No current offer found');

  } catch (error) {
    console.error('Error testing offer:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

testOffer(); 