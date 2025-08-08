import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const clearDummyProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gym-ecommerce');
    console.log('Connected to MongoDB');

    // Find and remove dummy products (those with placeholder images or dummy data)
    const dummyProducts = await Product.find({
      $or: [
        { 'images.url': { $regex: /picsum\.photos/, $options: 'i' } },
        { 'images.url': { $regex: /placeholder/, $options: 'i' } },
        { brand: { $in: ['Under Armour', 'Nike', 'Puma', 'Adidas'] } },
        { name: { $regex: /sample|dummy|test/, $options: 'i' } }
      ]
    });

    if (dummyProducts.length > 0) {
      console.log(`Found ${dummyProducts.length} dummy products to remove:`);
      dummyProducts.forEach(product => {
        console.log(`- ${product.name} (${product.brand})`);
      });

      const result = await Product.deleteMany({
        $or: [
          { 'images.url': { $regex: /picsum\.photos/, $options: 'i' } },
          { 'images.url': { $regex: /placeholder/, $options: 'i' } },
          { brand: { $in: ['Under Armour', 'Nike', 'Puma', 'Adidas'] } },
          { name: { $regex: /sample|dummy|test/, $options: 'i' } }
        ]
      });

      console.log(`Successfully removed ${result.deletedCount} dummy products`);
    } else {
      console.log('No dummy products found');
    }

    // Count remaining products
    const remainingProducts = await Product.countDocuments();
    console.log(`Remaining products in database: ${remainingProducts}`);

    console.log('Database cleanup completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing dummy products:', error);
    process.exit(1);
  }
};

clearDummyProducts(); 