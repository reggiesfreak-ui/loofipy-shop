// orderroutes.js
// This file defines the backend API routes for managing customer orders.
// It assumes you are using Node.js with the Express framework.

const express = require('express');
const router = express.Router();

// Mock database for orders
const orders = [
    {
        id: 'ORD-9021',
        customerName: 'Emma Watson',
        customerEmail: 'emma@example.com',
        items: [
            { productId: 'LF-101', name: 'Infinity Block', quantity: 1, price: 45.00 }
        ],
        totalAmount: 45.00,
        status: 'Reviewing',
        shippingAddress: '123 Main St, Portland, OR',
        orderDate: new Date('2026-05-15T10:30:00Z')
    },
    {
        id: 'ORD-8944',
        customerName: 'Liam Miller',
        customerEmail: 'liam@example.com',
        items: [
            { productId: 'LF-102', name: 'Sweetheart Charm', quantity: 2, price: 28.00 }
        ],
        totalAmount: 56.00,
        status: 'Printing',
        shippingAddress: '456 Oak Ave, Seattle, WA',
        orderDate: new Date('2026-05-14T14:20:00Z')
    },
    {
        id: 'ORD-8812',
        customerName: 'Jane Doe',
        customerEmail: 'jane.doe@example.com',
        items: [
            { productId: 'LF-104', name: 'The Storyteller Trio', quantity: 1, price: 85.00 }
        ],
        totalAmount: 85.00,
        status: 'Shipped',
        shippingAddress: '789 Pine Ln, Austin, TX',
        orderDate: new Date('2026-05-10T09:15:00Z')
    }
];

// GET /api/orders - Retrieve all orders (typically restricted to admins)
router.get('/', (req, res) => {
    // Optional: Filter by status via query parameter (e.g., ?status=Shipped)
    const status = req.query.status;
    if (status) {
        const filteredOrders = orders.filter(o => o.status.toLowerCase() === status.toLowerCase());
        return res.json({ success: true, count: filteredOrders.length, data: filteredOrders });
    }
    
    // Sort by orderDate descending (newest first)
    const sortedOrders = [...orders].sort((a, b) => b.orderDate - a.orderDate);
    res.json({ success: true, count: sortedOrders.length, data: sortedOrders });
});

// GET /api/orders/:id - Retrieve a specific order by ID
router.get('/:id', (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
});

// POST /api/orders - Create a new order (Checkout process)
router.post('/', (req, res) => {
    // In a real application, you would validate the request body, process payment,
    // and deduct inventory from products before creating the order.
    
    const newOrder = {
        id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
        customerName: req.body.customerName || 'Guest User',
        customerEmail: req.body.customerEmail,
        items: req.body.items || [], // Array of items bought
        totalAmount: req.body.totalAmount || 0,
        status: 'Pending', // Default status for new orders
        shippingAddress: req.body.shippingAddress,
        orderDate: new Date()
    };
    
    orders.push(newOrder);
    
    // Return a 201 Created status
    res.status(201).json({ 
        success: true, 
        message: 'Order successfully placed!', 
        data: newOrder 
    });
});

// PUT /api/orders/:id/status - Update the status of an order (Admin only)
router.put('/:id/status', (req, res) => {
    const index = orders.findIndex(o => o.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    const newStatus = req.body.status;
    if (!newStatus) {
        return res.status(400).json({ success: false, message: 'New status is required' });
    }
    
    // Update the status
    orders[index].status = newStatus;
    
    res.json({ 
        success: true, 
        message: `Order status updated to ${newStatus}`, 
        data: orders[index] 
    });
});

// DELETE /api/orders/:id - Cancel/Delete an order
router.delete('/:id', (req, res) => {
    const index = orders.findIndex(o => o.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    const canceledOrder = orders.splice(index, 1);
    res.json({ 
        success: true, 
        message: 'Order successfully canceled', 
        data: canceledOrder[0] 
    });
});

module.exports = router;
