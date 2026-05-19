/**
 * database.js
 * SQLite database setup & schema initialization.
 * File database: loofipy.db (dibuat otomatis di folder ini)
 */

const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'loofipy.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── CREATE TABLES ────────────────────────────────────────────────────────────
db.exec(`
  -- Tabel penjual (sellers)
  CREATE TABLE IF NOT EXISTS sellers (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE,
    password    TEXT    NOT NULL,
    store_name  TEXT    NOT NULL DEFAULT 'My Store',
    role        TEXT    NOT NULL DEFAULT 'seller' CHECK(role IN ('seller','admin')),
    avatar      TEXT,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    last_login  TEXT
  );

  -- Tabel produk (products)
  CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    seller_id   INTEGER NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    name        TEXT    NOT NULL,
    description TEXT,
    price       REAL    NOT NULL CHECK(price >= 0),
    stock       INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
    category    TEXT    NOT NULL,
    tags        TEXT    DEFAULT '[]',
    image_path  TEXT,
    status      TEXT    NOT NULL DEFAULT 'active' CHECK(status IN ('active','inactive','draft')),
    sales       INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

// ─── SEED: Default admin account ──────────────────────────────────────────────
// Cek apakah admin sudah ada
const adminExists = db.prepare('SELECT id FROM sellers WHERE email = ?').get('admin@loofipy.com');
if (!adminExists) {
  const bcrypt = require('bcryptjs');
  const salt = bcrypt.genSaltSync(10);

  const insertSeller = db.prepare(`
    INSERT INTO sellers (name, email, password, store_name, role, avatar)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Admin account
  insertSeller.run(
    'Admin Loofipy',
    'admin@loofipy.com',
    bcrypt.hashSync('admin2024', salt),
    'Loofipy HQ',
    'admin',
    'AL'
  );

  // Default seller account
  insertSeller.run(
    'Alex Rivera',
    'seller@loofipy.com',
    bcrypt.hashSync('seller123', salt),
    'Loofipy Official Store',
    'seller',
    'AR'
  );

  console.log('✅ Default accounts created (admin@loofipy.com / seller@loofipy.com)');
}

module.exports = db;
