// order.js
// This file defines the data model for an Order using Mongoose.
// It assumes you will use MongoDB as your database when the backend is fully connected.

// const mongoose = require('mongoose');

/*
const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    customer: {
        // In a real database, this would be a reference to a User model
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'User',
        name: { type: String, required: true },
        email: { type: String, required: true }
    },
    items: [{
        productId: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Printing', 'Reviewing', 'Shipped', 'Delivered', 'Canceled'],
        default: 'Pending'
    },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true, default: 'US' }
    },
    paymentId: {
        type: String,
        // References the transaction ID from the payment gateway
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

orderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// module.exports = mongoose.model('Order', orderSchema);
*/

// --- MOCK MODEL FOR DEVELOPMENT WITHOUT MONGODB ---

class Order {
    constructor(orderId, customer, items, totalAmount, shippingAddress) {
        this.orderId = orderId;
        this.customer = customer; // e.g., { name: 'John', email: 'john@example.com' }
        this.items = items; // Array of items
        this.totalAmount = totalAmount;
        this.shippingAddress = shippingAddress;
        this.status = 'Pending';
        this.paymentId = null;
        this.orderDate = new Date();
        this.updatedAt = new Date();
    }

    // Method to update order status
    updateStatus(newStatus) {
        const validStatuses = ['Pending', 'Processing', 'Printing', 'Reviewing', 'Shipped', 'Delivered', 'Canceled'];
        if (validStatuses.includes(newStatus)) {
            this.status = newStatus;
            this.updatedAt = new Date();
            return true;
        }
        return false;
    }

    // Method to attach a payment confirmation
    confirmPayment(transactionId) {
        this.paymentId = transactionId;
        this.updateStatus('Processing');
    }
}

module.exports = Order;
