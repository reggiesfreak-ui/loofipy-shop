// paymentroutes.js
// This file defines the backend API routes for securely handling payments.
// It assumes you are using Node.js with the Express framework.
// In a real production environment, this file would integrate with Payment Gateways 
// like Stripe, PayPal, or Midtrans using their official SDKs.

const express = require('express');
const router = express.Router();

// Mock database for payment transactions
const transactions = [
    {
        transactionId: 'TXN-9021-A',
        orderId: 'ORD-9021',
        amount: 45.00,
        currency: 'USD',
        status: 'Success',
        method: 'Credit Card (ending in 4242)',
        timestamp: new Date('2026-05-15T10:31:00Z')
    }
];

// POST /api/payments/process - Process a new payment during checkout
router.post('/process', (req, res) => {
    const { orderId, amount, paymentMethodDetails } = req.body;
    
    if (!orderId || !amount || !paymentMethodDetails) {
        return res.status(400).json({ 
            success: false, 
            message: 'Order ID, amount, and payment details are required.' 
        });
    }

    // --- MOCK PAYMENT PROCESSING LOGIC ---
    // In reality, you would send `paymentMethodDetails` (or a secure token) to Stripe/Midtrans here.
    
    // Simulating a network delay and card verification
    setTimeout(() => {
        // Mocking a successful payment
        const isSuccess = Math.random() > 0.1; // 90% success rate simulation
        
        if (isSuccess) {
            const newTransaction = {
                transactionId: `TXN-${Math.floor(Math.random() * 90000) + 10000}`,
                orderId: orderId,
                amount: amount,
                currency: 'USD',
                status: 'Success',
                method: 'Credit Card', // Abstracted for security
                timestamp: new Date()
            };
            
            transactions.push(newTransaction);
            
            return res.status(200).json({
                success: true,
                message: 'Payment processed successfully.',
                transactionId: newTransaction.transactionId,
                receiptUrl: `/receipts/${newTransaction.transactionId}`
            });
        } else {
            // Mocking a failed payment (e.g., insufficient funds)
            return res.status(400).json({
                success: false,
                message: 'Payment failed. Your card was declined.',
                errorCode: 'card_declined'
            });
        }
    }, 1500); // 1.5 seconds simulated delay
});

// GET /api/payments/:transactionId/status - Check the status of a specific payment
router.get('/:transactionId/status', (req, res) => {
    const transaction = transactions.find(t => t.transactionId === req.params.transactionId);
    
    if (!transaction) {
        return res.status(404).json({ 
            success: false, 
            message: 'Transaction not found.' 
        });
    }
    
    res.json({ 
        success: true, 
        status: transaction.status,
        amount: transaction.amount 
    });
});

// POST /api/payments/:transactionId/refund - Process a refund for a successful payment (Admin only)
router.post('/:transactionId/refund', (req, res) => {
    const transactionIndex = transactions.findIndex(t => t.transactionId === req.params.transactionId);
    
    if (transactionIndex === -1) {
        return res.status(404).json({ 
            success: false, 
            message: 'Transaction not found.' 
        });
    }
    
    const transaction = transactions[transactionIndex];
    
    if (transaction.status === 'Refunded') {
        return res.status(400).json({ 
            success: false, 
            message: 'This transaction has already been refunded.' 
        });
    }

    // Mocking the refund process
    transaction.status = 'Refunded';
    transaction.refundTimestamp = new Date();
    
    res.json({
        success: true,
        message: 'Payment refunded successfully.',
        transactionId: transaction.transactionId,
        refundedAmount: transaction.amount
    });
});

module.exports = router;
