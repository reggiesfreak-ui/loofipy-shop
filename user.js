// user.js
// This file defines the data model for a User (Customer/Admin) using Mongoose.
// It assumes you will use MongoDB as your database when the backend is fully connected.

// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt'); // Used for hashing passwords securely

/*
const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false // Ensures password isn't returned in queries by default
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    savedAddresses: [{
        street: String,
        city: String,
        state: String,
        zipCode: String,
        isDefault: Boolean
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
});

// Middleware to hash the password before saving to the database
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to check if a provided password matches the hashed password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// module.exports = mongoose.model('User', userSchema);
*/

// --- MOCK MODEL FOR DEVELOPMENT WITHOUT MONGODB ---

class User {
    constructor(userId, name, email, rawPassword, role = 'customer') {
        this.userId = userId;
        this.name = name;
        this.email = email.toLowerCase();
        // In a real app, NEVER store plain text passwords. 
        // This is strictly for local prototype simulation.
        this._mockHashedPassword = `hashed_${rawPassword}_123`; 
        this.role = role;
        this.savedAddresses = [];
        this.createdAt = new Date();
        this.lastLogin = null;
    }

    // Mock method to verify password
    verifyPassword(passwordInput) {
        return this._mockHashedPassword === `hashed_${passwordInput}_123`;
    }

    // Method to update login timestamp
    recordLogin() {
        this.lastLogin = new Date();
    }

    // Method to add a new address
    addAddress(addressDetails) {
        this.savedAddresses.push(addressDetails);
    }
}

module.exports = User;
