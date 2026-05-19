#!/usr/bin/env node

/**
 * scripts/migrate-to-postgres.js
 * Migrate data dari SQLite ke PostgreSQL
 * 
 * Usage: node migrate-to-postgres.js
 * 
 * Pastikan sudah set DATABASE_URL di .env
 */

const Database = require('better-sqlite3');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const sqliteDbPath = path.join(__dirname, '..', 'loofipy.db');
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Error: DATABASE_URL belum diset di .env');
  process.exit(1);
}

async function migrate() {
  try {
    console.log('🔄 Starting migration SQLite → PostgreSQL...\n');

    // Connect ke SQLite
    const sqliteDb = new Database(sqliteDbPath);
    console.log('✅ Connected to SQLite');

    // Connect ke PostgreSQL
    const pool = new Pool({ connectionString: databaseUrl });
    const pgClient = await pool.connect();
    console.log('✅ Connected to PostgreSQL\n');

    // ─── Create tables di PostgreSQL ───
    console.log('📋 Creating tables...');
    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS sellers (
        id          SERIAL PRIMARY KEY,
        name        TEXT    NOT NULL,
        email       TEXT    NOT NULL UNIQUE,
        password    TEXT    NOT NULL,
        store_name  TEXT    NOT NULL DEFAULT 'My Store',
        role        TEXT    NOT NULL DEFAULT 'seller' CHECK(role IN ('seller','admin')),
        avatar      TEXT,
        created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_login  TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        id          SERIAL PRIMARY KEY,
        seller_id   INTEGER NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
        name        TEXT    NOT NULL,
        description TEXT,
        price       DECIMAL(10, 2) NOT NULL CHECK(price >= 0),
        stock       INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
        category    TEXT    NOT NULL,
        tags        TEXT    DEFAULT '[]',
        image_path  TEXT,
        status      TEXT    NOT NULL DEFAULT 'active' CHECK(status IN ('active','inactive','draft')),
        sales       INTEGER NOT NULL DEFAULT 0,
        created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
      CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
    `);
    console.log('✅ Tables created\n');

    // ─── Migrate data ───
    console.log('📊 Migrating data...');

    // Migrate sellers
    const sellers = sqliteDb.prepare('SELECT * FROM sellers').all();
    console.log(`  └─ Sellers: ${sellers.length} records`);
    
    for (const seller of sellers) {
      await pgClient.query(
        `INSERT INTO sellers (id, name, email, password, store_name, role, avatar, created_at, last_login)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (email) DO NOTHING`,
        [seller.id, seller.name, seller.email, seller.password, seller.store_name, seller.role, seller.avatar, seller.created_at, seller.last_login]
      );
    }

    // Migrate products
    const products = sqliteDb.prepare('SELECT * FROM products').all();
    console.log(`  └─ Products: ${products.length} records`);
    
    for (const product of products) {
      await pgClient.query(
        `INSERT INTO products (id, seller_id, name, description, price, stock, category, tags, image_path, status, sales, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [product.id, product.seller_id, product.name, product.description, product.price, product.stock, product.category, product.tags, product.image_path, product.status, product.sales, product.created_at, product.updated_at]
      );
    }

    console.log('\n✅ Migration successful!\n');

    // Verify
    const sellerCount = await pgClient.query('SELECT COUNT(*) FROM sellers');
    const productCount = await pgClient.query('SELECT COUNT(*) FROM products');

    console.log('📈 Data Summary:');
    console.log(`  └─ Sellers: ${sellerCount.rows[0].count}`);
    console.log(`  └─ Products: ${productCount.rows[0].count}\n`);

    console.log('🎉 Migration selesai! Update DATABASE_URL di .env production\n');

    // Cleanup
    pgClient.release();
    await pool.end();
    sqliteDb.close();

  } catch (error) {
    console.error('❌ Migration error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

migrate();
