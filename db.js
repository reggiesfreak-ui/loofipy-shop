// db.js
// This file handles the connection to your MongoDB database.

// const mongoose = require('mongoose');

/*
const connectDB = async () => {
    try {
        // You would typically get this URI from a .env file
        // const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/loofipy_shop';
        
        const conn = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`\x1b[36m MongoDB Connected: ${conn.connection.host} \x1b[0m`);
    } catch (error) {
        console.error(`\x1b[31m Error connecting to MongoDB: ${error.message} \x1b[0m`);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
*/

// --- MOCK DATABASE CONNECTION FOR DEVELOPMENT ---
const connectDB = () => {
    console.log('\x1b[36m%s\x1b[0m', '📦 Mock Database "Connected" (Running without MongoDB)');
};

module.exports = connectDB;
