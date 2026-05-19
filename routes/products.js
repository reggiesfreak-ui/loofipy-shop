/**
 * routes/products.js
 * API endpoints untuk manajemen produk penjual.
 *
 * GET    /api/products          — Ambil semua produk milik seller (butuh token)
 * POST   /api/products          — Tambah produk baru (butuh token)
 * PUT    /api/products/:id      — Edit produk (butuh token, harus milik seller)
 * DELETE /api/products/:id      — Hapus produk (butuh token, harus milik seller)
 * GET    /api/products/public   — Ambil semua produk aktif (publik, untuk halaman toko)
 */

const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const db      = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// ─── MULTER (Upload Gambar) ────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.'));
  }
});

// ─── GET PUBLIC PRODUCTS (untuk halaman toko) ─────────────────────────────────
router.get('/public', (req, res) => {
  const { category, search, limit = 50, offset = 0 } = req.query;

  let query = `
    SELECT p.*, s.store_name, s.name as seller_name
    FROM products p
    JOIN sellers s ON s.id = p.seller_id
    WHERE p.status = 'active'
  `;
  const params = [];

  if (category) { query += ` AND p.category = ?`; params.push(category); }
  if (search)   { query += ` AND (p.name LIKE ? OR p.description LIKE ?)`; params.push(`%${search}%`, `%${search}%`); }

  query += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), parseInt(offset));

  const products = db.prepare(query).all(...params);

  // Parse tags dari JSON string
  const parsed = products.map(p => ({ ...p, tags: JSON.parse(p.tags || '[]') }));
  return res.json({ success: true, products: parsed, total: parsed.length });
});

// ─── GET MY PRODUCTS ──────────────────────────────────────────────────────────
router.get('/', authMiddleware, (req, res) => {
  const products = db.prepare(
    'SELECT * FROM products WHERE seller_id = ? ORDER BY created_at DESC'
  ).all(req.seller.id);

  const parsed = products.map(p => ({ ...p, tags: JSON.parse(p.tags || '[]') }));
  return res.json({ success: true, products: parsed });
});

// ─── ADD PRODUCT ─────────────────────────────────────────────────────────────
router.post('/', authMiddleware, upload.single('image'), (req, res) => {
  const { name, description, price, stock, category, tags, status } = req.body;

  // Validasi
  if (!name || !price || !category) {
    return res.status(400).json({ success: false, message: 'Nama, harga, dan kategori wajib diisi.' });
  }
  if (isNaN(price) || parseFloat(price) < 0) {
    return res.status(400).json({ success: false, message: 'Harga tidak valid.' });
  }
  if (isNaN(stock) || parseInt(stock) < 0) {
    return res.status(400).json({ success: false, message: 'Stok tidak valid.' });
  }

  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  const tagsJson  = tags ? JSON.stringify(JSON.parse(tags)) : '[]';

  const result = db.prepare(`
    INSERT INTO products (seller_id, name, description, price, stock, category, tags, image_path, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    req.seller.id, name, description || '', parseFloat(price),
    parseInt(stock || 0), category, tagsJson, imagePath, status || 'active'
  );

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json({
    success: true,
    message: 'Produk berhasil ditambahkan!',
    product: { ...product, tags: JSON.parse(product.tags || '[]') }
  });
});

// ─── UPDATE PRODUCT ───────────────────────────────────────────────────────────
router.put('/:id', authMiddleware, upload.single('image'), (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ? AND seller_id = ?')
    .get(req.params.id, req.seller.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
  }

  const { name, description, price, stock, category, tags, status } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : product.image_path;
  const tagsJson  = tags ? JSON.stringify(JSON.parse(tags)) : product.tags;

  db.prepare(`
    UPDATE products
    SET name=?, description=?, price=?, stock=?, category=?, tags=?, image_path=?, status=?, updated_at=datetime('now')
    WHERE id=? AND seller_id=?
  `).run(
    name || product.name,
    description !== undefined ? description : product.description,
    price !== undefined ? parseFloat(price) : product.price,
    stock !== undefined ? parseInt(stock) : product.stock,
    category || product.category,
    tagsJson,
    imagePath,
    status || product.status,
    req.params.id,
    req.seller.id
  );

  const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  return res.json({
    success: true,
    message: 'Produk berhasil diperbarui!',
    product: { ...updated, tags: JSON.parse(updated.tags || '[]') }
  });
});

// ─── DELETE PRODUCT ───────────────────────────────────────────────────────────
router.delete('/:id', authMiddleware, (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ? AND seller_id = ?')
    .get(req.params.id, req.seller.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
  }

  // Hapus file gambar jika ada
  if (product.image_path) {
    const filePath = path.join(__dirname, '..', product.image_path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  db.prepare('DELETE FROM products WHERE id = ? AND seller_id = ?').run(req.params.id, req.seller.id);

  return res.json({ success: true, message: 'Produk berhasil dihapus.' });
});

module.exports = router;
