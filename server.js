/**
 * server.js  (VERSI BARU — Express + SQLite + JWT)
 * Menggantikan server lama yang hanya melayani file statis.
 *
 * Fitur:
 *  - Melayani file HTML/CSS/JS statis
 *  - REST API untuk auth dan produk
 *  - Upload gambar produk
 *  - CORS enabled untuk development
 *  - Security headers (helmet)
 *  - Rate limiting
 */

// Load environment variables
require('dotenv').config();

const express       = require('express');
const cors          = require('cors');
const helmet        = require('helmet');
const rateLimit     = require('express-rate-limit');
const path          = require('path');

// Inisialisasi database (membuat loofipy.db + tabel + seed data)
require('./database');

const authRoutes    = require('./routes/auth');
const productRoutes = require('./routes/products');

const app  = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: NODE_ENV === 'production' ? CORS_ORIGIN : '*',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate limiting (general)
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Terlalu banyak request, coba lagi nanti.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(generalLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve gambar yang diupload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve file statis (HTML, CSS, JS)
app.use(express.static(__dirname));

// ─── API ROUTES ───────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Loofipy API berjalan!', time: new Date().toISOString() });
});

// ─── FALLBACK: Semua route lain → index.html ──────────────────────────────────
app.get('*', (req, res) => {
  // Jika request API yang tidak ditemukan, kembalikan 404 JSON
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan.' });
  }
  // Untuk halaman HTML lainnya
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ─── ERROR HANDLER ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'Ukuran file terlalu besar (maks 5MB).' });
  }
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// ─── START ────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log('\x1b[36m%s\x1b[0m', '==========================================');
  console.log('\x1b[32m%s\x1b[0m', `🚀 Loofipy Server (Express + SQLite)`);
  console.log('\x1b[33m%s\x1b[0m', `📝 Environment: ${NODE_ENV.toUpperCase()}`);
  console.log('\x1b[33m%s\x1b[0m', `👉 Toko:       http://localhost:${PORT}`);
  console.log('\x1b[33m%s\x1b[0m', `👉 Seller Login: http://localhost:${PORT}/seller-login.html`);
  console.log('\x1b[33m%s\x1b[0m', `👉 API:        http://localhost:${PORT}/api/health`);
  console.log('\x1b[36m%s\x1b[0m', '==========================================');
  console.log('🔑 Demo: seller@loofipy.com / seller123');
  console.log('Press Ctrl+C to stop.\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});
