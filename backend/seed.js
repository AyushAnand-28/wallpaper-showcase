import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Store from "./models/Store.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || "mongodb://localhost:27017/secondbite");
    console.log("Connected to MongoDB database.");

    // Clear existing data
    await User.deleteMany();
    await Store.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log("Cleared existing data.");

    // Create Users
    const consumer = new User({
      name: "Simran Consumer",
      email: "consumer@example.com",
      password: "password123",
      role: "CONSUMER",
      phone: "1234567890"
    });
    await consumer.save(); // pre('save') should handle bcrypt

    const storeOwner1 = new User({
      name: "Ravi Owner",
      email: "owner@example.com",
      password: "password123",
      role: "STORE_OWNER",
      phone: "0987654321"
    });
    await storeOwner1.save();
    
    // Create Stores
    const store1 = await Store.create({
      name: "Da Maria Bakery",
      description: "Authentic sourdough and pastries rescued fresh daily.",
      address: "123 Vintage Lane",
      city: "Mumbai",
      isVerified: true,
      owner: storeOwner1._id
    });

    const store2 = await Store.create({
      name: "Green Leaf Organics",
      description: "Organic produce saved from the landfill.",
      address: "45 Market St",
      city: "Bengaluru",
      isVerified: true,
      owner: storeOwner1._id
    });

    // Create Products
    const products = await Product.create([
      {
        name: "Sourdough Loaf",
        description: "Freshly baked today morning. Perfect for sandwiches.",
        price: 45,
        originalPrice: 130,
        quantity: 8,
        expiryDate: new Date(Date.now() + 86400000), // tomorrow
        category: "BAKERY",
        store: store1._id
      },
      {
        name: "Croissant Box (6pcs)",
        description: "Buttery, flaky croissants.",
        price: 80,
        originalPrice: 220,
        quantity: 4,
        expiryDate: new Date(Date.now() + 2 * 86400000),
        category: "BAKERY",
        store: store1._id
      },
      {
        name: "Organic Spinach Bunch",
        description: "Slightly bruised leaves but perfectly fine for cooking.",
        price: 20,
        originalPrice: 50,
        quantity: 15,
        expiryDate: new Date(Date.now() + 86400000), // tomorrow
        category: "PRODUCE",
        store: store2._id
      },
      {
        name: "Artisan Cheddar",
        description: "Aged 12 months. Close to best before date.",
        price: 120,
        originalPrice: 280,
        quantity: 6,
        expiryDate: new Date(Date.now() + 5 * 86400000),
        category: "DAIRY",
        store: store1._id
      }
    ]);

    // Create Orders
    const order1 = await Order.create({
      user: consumer._id,
      store: store1._id,
      items: [
        {
          product: products[0]._id,
          name: products[0].name,
          price: products[0].price,
          quantity: 2
        }
      ],
      totalPrice: 90,
      status: "COMPLETED",
      note: "Please pack well."
    });

    const order2 = await Order.create({
      user: consumer._id,
      store: store2._id,
      items: [
        {
          product: products[2]._id,
          name: products[2].name,
          price: products[2].price,
          quantity: 3
        }
      ],
      totalPrice: 60,
      status: "CONFIRMED"
    });

    console.log("Dummy data seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
