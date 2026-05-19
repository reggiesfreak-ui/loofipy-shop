// productroutes.js
// This file defines the backend API routes for managing products.
// It assumes you are using Node.js with the Express framework.

const express = require('express');
const router = express.Router();

// Mock database for products
const products = [
    {
        id: 'LF-101',
        name: 'Infinity Block',
        category: 'Photo Stands',
        price: 45.00,
        stock: 12,
        description: 'A heavy-weight solid acrylic block that stands independently, reflecting light through every polished edge.',
        imageUrl: '/images/infinity-block.jpg'
    },
    {
        id: 'LF-102',
        name: 'Sweetheart Charm',
        category: 'Charms',
        price: 28.00,
        stock: 45,
        description: 'Delicate heart-shaped ornament with precision etching, perfect for holiday trees or window displays.',
        imageUrl: '/images/sweetheart-charm.jpg'
    },
    {
        id: 'LF-103',
        name: 'Mini Memories',
        category: 'Keychains',
        price: 18.00,
        stock: 120,
        description: 'Take your favorite moments everywhere with these scratch-resistant acrylic keychains.',
        imageUrl: '/images/mini-memories.jpg'
    },
    {
        id: 'LF-104',
        name: 'The Storyteller Trio',
        category: 'Photo Stands',
        price: 85.00,
        stock: 8,
        description: 'Three interlocking acrylic panels create a stunning 3D depth effect on any shelf or desk.',
        imageUrl: '/images/storyteller-trio.jpg'
    }
];

// GET /api/products - Retrieve all products
router.get('/', (req, res) => {
    // Check if there is a category filter in the query string
    const category = req.query.category;
    if (category) {
        const filteredProducts = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
        return res.json({ success: true, count: filteredProducts.length, data: filteredProducts });
    }
    res.json({ success: true, count: products.length, data: products });
});

// GET /api/products/:id - Retrieve a single product by ID
router.get('/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
});

// POST /api/products - Create a new product (requires authentication in a real app)
router.post('/', (req, res) => {
    const newProduct = {
        id: `LF-${Math.floor(Math.random() * 1000) + 200}`, // Generate mock ID
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock || 0,
        description: req.body.description || '',
        imageUrl: req.body.imageUrl || '/images/placeholder.jpg'
    };
    
    // In a real app, we would save this to a database
    products.push(newProduct);
    
    res.status(201).json({ success: true, data: newProduct });
});

// PUT /api/products/:id - Update an existing product
router.put('/:id', (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Update fields
    products[index] = { ...products[index], ...req.body, id: products[index].id };
    res.json({ success: true, data: products[index] });
});

// DELETE /api/products/:id - Delete a product
router.delete('/:id', (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    const deletedProduct = products.splice(index, 1);
    res.json({ success: true, data: deletedProduct[0], message: 'Product successfully deleted' });
});

module.exports = router;
