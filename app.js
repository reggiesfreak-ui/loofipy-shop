// app.js
// This is the main entry point for your Express Backend API.
// It connects all your routes (products, orders, payments) into one running server.

// Note: To run this, you need to install express and cors:
// npm install express cors

const express = require('express');
const path = require('path');
// const cors = require('cors'); // Uncomment if frontend and backend are on different ports

// Import our custom route files
const productRoutes = require('./productroutes');
const orderRoutes = require('./orderroutes');
const paymentRoutes = require('./paymentroutes');

// Import database connection (mocked/commented out for now)
// const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 5000; // Backend typically runs on a different port than frontend

// Connect to Database
// connectDB();

// Middleware
// app.use(cors()); // Allow Cross-Origin requests
app.use(express.json()); // Allow parsing of JSON data in request bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the root directory (so the frontend still works)
app.use(express.static(path.join(__dirname)));

// API Routes setup
// Every request starting with /api/products will be handled by productroutes.js
app.use('/api/products', productRoutes);

// Every request starting with /api/orders will be handled by orderroutes.js
app.use('/api/orders', orderRoutes);

// Every request starting with /api/payments will be handled by paymentroutes.js
app.use('/api/payments', paymentRoutes);

// Fallback Route: If a user hits a route that doesn't exist, send them to the frontend index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong on the server!'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log('\x1b[35m%s\x1b[0m', '========================================');
    console.log('\x1b[32m%s\x1b[0m', `🚀 Loofipy Backend API is running!`);
    console.log('\x1b[33m%s\x1b[0m', `👉 Local API URL: http://localhost:${PORT}/api`);
    console.log('\x1b[36m%s\x1b[0m', `👉 Frontend URL:  http://localhost:${PORT}`);
    console.log('\x1b[35m%s\x1b[0m', '========================================');
});
