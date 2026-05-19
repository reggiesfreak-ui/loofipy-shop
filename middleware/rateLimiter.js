/**
 * middleware/rateLimiter.js
 * Rate limiting untuk berbagai endpoint
 */

const rateLimit = require('express-rate-limit');

// Strict rate limiting untuk auth (login/register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'test',
});

// Moderate rate limiting untuk API umum
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: 'Terlalu banyak request. Coba lagi nanti.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiting untuk upload
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 uploads per hour
  message: 'Terlalu banyak upload. Coba lagi dalam 1 jam.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authLimiter,
  apiLimiter,
  uploadLimiter,
};
