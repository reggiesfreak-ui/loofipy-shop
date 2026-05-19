/**
 * routes/auth.js
 * API endpoints untuk login & register penjual.
 *
 * POST /api/auth/register  — Daftar akun penjual baru
 * POST /api/auth/login     — Login dan dapatkan JWT token
 * GET  /api/auth/me        — Cek sesi (butuh token)
 */

const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../database');
const { authMiddleware } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'loofipy_secret_key_2024';
const JWT_EXPIRES = '7d';

// ─── REGISTER ─────────────────────────────────────────────────────────────────
router.post('/register', authLimiter, (req, res) => {
  const { name, email, password, store_name } = req.body;

  // Validasi input
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Nama, email, dan password wajib diisi.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password minimal 6 karakter.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Format email tidak valid.' });
  }

  // Cek email sudah terdaftar
  const existing = db.prepare('SELECT id FROM sellers WHERE email = ?').get(email.toLowerCase());
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email sudah terdaftar.' });
  }

  // Hash password dan simpan
  const hashedPassword = bcrypt.hashSync(password, 10);
  const avatar = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const result = db.prepare(`
    INSERT INTO sellers (name, email, password, store_name, avatar)
    VALUES (?, ?, ?, ?, ?)
  `).run(name, email.toLowerCase(), hashedPassword, store_name || `${name}'s Store`, avatar);

  const seller = db.prepare('SELECT id, name, email, store_name, role, avatar, created_at FROM sellers WHERE id = ?').get(result.lastInsertRowid);

  const token = jwt.sign({ id: seller.id, role: seller.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

  return res.status(201).json({
    success: true,
    message: 'Akun berhasil dibuat!',
    token,
    seller
  });
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
router.post('/login', authLimiter, (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' });
  }

  const seller = db.prepare('SELECT * FROM sellers WHERE email = ?').get(email.toLowerCase());

  if (!seller || !bcrypt.compareSync(password, seller.password)) {
    return res.status(401).json({ success: false, message: 'Email atau password salah.' });
  }

  // Update last_login
  db.prepare("UPDATE sellers SET last_login = datetime('now') WHERE id = ?").run(seller.id);

  const token = jwt.sign({ id: seller.id, role: seller.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

  const { password: _, ...sellerData } = seller; // Jangan kirim password ke client

  return res.json({
    success: true,
    message: 'Login berhasil!',
    token,
    seller: sellerData
  });
});

// ─── GET CURRENT USER ─────────────────────────────────────────────────────────
router.get('/me', authMiddleware, (req, res) => {
  const seller = db.prepare(
    'SELECT id, name, email, store_name, role, avatar, created_at, last_login FROM sellers WHERE id = ?'
  ).get(req.seller.id);

  if (!seller) {
    return res.status(404).json({ success: false, message: 'Akun tidak ditemukan.' });
  }

  return res.json({ success: true, seller });
});

module.exports = router;
