// customer.js
// This file defines the data model for a Customer Profile using Mongoose.
// In a typical e-commerce system, this model links to a standard User model 
// but stores customer-specific business logic like loyalty points and wishlists.

// const mongoose = require('mongoose');

/*
const customerSchema = new mongoose.Schema({
    // Link this profile to the core User account
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    loyaltyPoints: {
        type: Number,
        default: 0,
        min: 0
    },
    wishlist: [{
        // Links to the Product model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    totalSpent: {
        type: Number,
        default: 0,
        min: 0
    },
    preferences: {
        newsletterOptIn: { type: Boolean, default: false },
        preferredCategories: [{ type: String }]
    },
    customerTier: {
        type: String,
        enum: ['Standard', 'Silver', 'Gold', 'Platinum'],
        default: 'Standard'
    },
    joinedDate: {
        type: Date,
        default: Date.now
    }
});

// Middleware to automatically update customer tier based on total spent
customerSchema.pre('save', function(next) {
    if (this.totalSpent > 1000) {
        this.customerTier = 'Platinum';
    } else if (this.totalSpent > 500) {
        this.customerTier = 'Gold';
    } else if (this.totalSpent > 150) {
        this.customerTier = 'Silver';
    } else {
        this.customerTier = 'Standard';
    }
    next();
});

// module.exports = mongoose.model('CustomerProfile', customerSchema);
*/

// --- MOCK MODEL FOR DEVELOPMENT WITHOUT MONGODB ---

class CustomerProfile {
    constructor(userId) {
        this.userId = userId; // References the ID in user.js
        this.loyaltyPoints = 0;
        this.wishlist = []; // Array of Product IDs
        this.totalSpent = 0;
        this.preferences = {
            newsletterOptIn: false,
            preferredCategories: []
        };
        this.customerTier = 'Standard';
        this.joinedDate = new Date();
    }

    // Method to add a product to the wishlist
    addToWishlist(productId) {
        if (!this.wishlist.includes(productId)) {
            this.wishlist.push(productId);
            return true;
        }
        return false;
    }

    // Method to record a purchase and update points & tiers
    recordPurchase(amount) {
        this.totalSpent += amount;
        
        // Earn 1 loyalty point for every $1 spent
        this.loyaltyPoints += Math.floor(amount);
        
        this.updateTier();
    }

    // Private-like method to update the customer tier
    updateTier() {
        if (this.totalSpent > 1000) {
            this.customerTier = 'Platinum';
        } else if (this.totalSpent > 500) {
            this.customerTier = 'Gold';
        } else if (this.totalSpent > 150) {
            this.customerTier = 'Silver';
        } else {
            this.customerTier = 'Standard';
        }
    }
}

module.exports = CustomerProfile;
