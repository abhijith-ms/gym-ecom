import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';

dotenv.config();

const sampleProducts = [
  {
    name: "Men's Athletic T-Shirt",
    description: "Premium cotton blend athletic t-shirt perfect for workouts and casual wear. Features moisture-wicking technology to keep you dry and comfortable.",
    price: 29.99,
    originalPrice: 39.99,
    category: "topwear",
    brand: "Under Armour",
    material: "Cotton blend",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", code: "#000000" },
      { name: "Navy", code: "#000080" },
      { name: "Grey", code: "#808080" }
    ],
    images: [
      {
        url: "https://picsum.photos/500/500?random=5",
        altText: "Men's Athletic T-Shirt Black"
      },
      {
        url: "https://picsum.photos/500/500?random=6",
        altText: "Men's Athletic T-Shirt Navy"
      }
    ],
    stock: 100,
    isFeatured: true,
    tags: ["athletic", "moisture-wicking", "comfortable"]
  },
  {
    name: "Men's Running Shorts",
    description: "Lightweight running shorts with built-in liner and zip pocket. Perfect for running, training, or casual wear.",
    price: 34.99,
    originalPrice: 44.99,
    category: "bottomwear",
    brand: "Nike",
    material: "Polyester blend",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", code: "#000000" },
      { name: "Grey", code: "#808080" },
      { name: "Blue", code: "#0066CC" }
    ],
    images: [
      {
        url: "https://picsum.photos/500/500?random=13",
        altText: "Men's Running Shorts Black"
      },
      {
        url: "https://picsum.photos/500/500?random=14",
        altText: "Men's Running Shorts Grey"
      }
    ],
    stock: 60,
    isNewArrival: true,
    tags: ["running", "lightweight", "comfortable"]
  },
  {
    name: "Men's Polo Shirt",
    description: "Classic fit polo shirt for men, perfect for both casual and semi-formal occasions.",
    price: 39.99,
    originalPrice: 49.99,
    category: "topwear",
    brand: "Puma",
    material: "Cotton",
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "White", code: "#FFFFFF" },
      { name: "Blue", code: "#0066CC" }
    ],
    images: [
      {
        url: "https://picsum.photos/500/500?random=15",
        altText: "Men's Polo Shirt White"
      },
      {
        url: "https://picsum.photos/500/500?random=16",
        altText: "Men's Polo Shirt Blue"
      }
    ],
    stock: 80,
    isFeatured: true,
    tags: ["polo", "classic", "casual"]
  },
  {
    name: "Men's Track Pants",
    description: "Comfortable track pants for men, ideal for workouts and lounging.",
    price: 44.99,
    originalPrice: 59.99,
    category: "bottomwear",
    brand: "Adidas",
    material: "Polyester",
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Black", code: "#000000" },
      { name: "Grey", code: "#808080" }
    ],
    images: [
      {
        url: "https://picsum.photos/500/500?random=17",
        altText: "Men's Track Pants Black"
      },
      {
        url: "https://picsum.photos/500/500?random=18",
        altText: "Men's Track Pants Grey"
      }
    ],
    stock: 70,
    isBestSeller: true,
    tags: ["track pants", "workout", "comfortable"]
  }
];

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gym-ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@gym.com',
      password: 'admin123',
      phone: '+1234567890',
      role: 'admin',
      address: {
        street: '123 Admin St',
        city: 'Admin City',
        state: 'Admin State',
        zipCode: '12345',
        country: 'Admin Country'
      }
    });
    console.log('Admin user created:', adminUser.email);

    // Create regular user
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'john@gym.com',
      password: 'user123',
      phone: '+1987654321',
      role: 'user',
      address: {
        street: '456 User Ave',
        city: 'User City',
        state: 'User State',
        zipCode: '54321',
        country: 'User Country'
      }
    });
    console.log('Regular user created:', regularUser.email);

    // Create products
    const products = await Product.create(sampleProducts);
    console.log(`${products.length} products created`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData(); 