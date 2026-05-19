// product.js
// This file defines the data model for a Product using Mongoose.
// It assumes you will use MongoDB as your database when the backend is fully connected.

// Note: To use this file, you must install mongoose via npm: `npm install mongoose`
// const mongoose = require('mongoose');

/*
const productSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: ['Keychains', 'Photo Stands', 'Charms', 'Accessories'],
        index: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'Stock cannot be negative']
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxLength: [1000, 'Description cannot exceed 1000 characters']
    },
    imageUrl: {
        type: String,
        required: true,
        default: '/images/placeholder.jpg'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the 'updatedAt' field automatically before saving
productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Export the model
// module.exports = mongoose.model('Product', productSchema);
*/

// --- MOCK MODEL FOR DEVELOPMENT WITHOUT MONGODB ---
// Since Node.js and MongoDB aren't fully set up yet, this exports a standard 
// JavaScript class that mimics how the model would behave.

class Product {
    constructor(id, name, category, price, stock, description, imageUrl) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.stock = stock;
        this.description = description;
        this.imageUrl = imageUrl || '/images/placeholder.jpg';
        this.isActive = true;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // Method to check if item is in stock
    isAvailable(quantityRequested = 1) {
        return this.isActive && this.stock >= quantityRequested;
    }

    // Method to reduce stock after a purchase
    reduceStock(amount) {
        if (this.isAvailable(amount)) {
            this.stock -= amount;
            this.updatedAt = new Date();
            return true;
        }
        return false;
    }
}

module.exports = Product;
