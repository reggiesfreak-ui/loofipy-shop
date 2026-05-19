/**
 * middleware/auth.js
 * JWT middleware — memverifikasi token dari header Authorization.
 * Digunakan di semua endpoint yang membutuhkan login.
 */

const jwt = require('jsonwebtoken');
const db  = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'loofipy_secret_key_2024';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // Token harus dikirim dalam format: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak. Token tidak ditemukan. Silakan login terlebih dahulu.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Pastikan seller masih ada di database
    const seller = db.prepare(
      'SELECT id, name, email, store_name, role FROM sellers WHERE id = ?'
    ).get(decoded.id);

    if (!seller) {
      return res.status(401).json({ success: false, message: 'Akun tidak ditemukan.' });
    }

    req.seller = seller; // Attach data seller ke request
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Sesi habis. Silakan login ulang.' });
    }
    return res.status(401).json({ success: false, message: 'Token tidak valid.' });
  }
}

// Middleware khusus admin
function adminMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.seller.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Akses ditolak. Hanya admin.' });
    }
    next();
  });
}

module.exports = { authMiddleware, adminMiddleware };
