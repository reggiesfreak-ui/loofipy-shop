# Loofipy Shop

Loofipy adalah aplikasi e-commerce full-stack untuk penjual dan pembeli, dibangun dengan Express.js, SQLite, JWT, dan frontend statis.

## Struktur

- `server.js` - server Express utama
- `database.js` - setup SQLite dan seed data
- `routes/` - endpoint API auth dan produk
- `middleware/` - auth dan rate limiting
- `scripts/` - utilitas deployment dan testing
- `public` files di root - HTML, CSS, JS statis untuk frontend

## Persiapan Lokal

1. Install dependencies:
   ```bash
   npm install
   ```

2. Buat `.env` dari `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Jalankan server:
   ```bash
   npm start
   ```

4. Buka aplikasi:
   ```
   http://localhost:3000
   ```

## Environment Variables

Gunakan file `.env` untuk konfigurasi lokal. Contoh variable:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your_secret_key_here
DATABASE_PATH=./loofipy.db
CORS_ORIGIN=http://localhost:3000
MAX_FILE_SIZE=5242880
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

> Untuk production, atur variable di Railway dashboard.

## Deployment ke GitHub + Railway

### 1. Tambah remote GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

### 2. Setup Railway

1. Install Railway CLI:
   ```bash
   npm install -g railway
   ```
2. Login Railway:
   ```bash
   railway login
   ```
3. Link project:
   ```bash
   railway link
   ```
4. Set environment variables di Railway dashboard:
   - `JWT_SECRET`
   - `DATABASE_URL`
   - `CORS_ORIGIN`
   - `PORT` (jika diperlukan)

5. Deploy:
   ```bash
   railway up
   ```

### 3. Otomatis deploy via GitHub Actions

File `.github/workflows/deploy.yml` sudah tersedia di repo.

## Catatan Penting

- `loofipy.db` dan folder `uploads/` sudah ada di `.gitignore`.
- Jangan commit file `.env` atau secret production ke GitHub.
- Saat menggunakan Railway, ganti SQLite lokal dengan database PostgreSQL atau storage cloud.

## Script yang tersedia

- `npm start` - jalankan server
- `npm run test` - jalankan API test script
- `npm run generate-secret` - generate JWT secret production
- `npm run migrate-postgres` - migrasi data SQLite ke PostgreSQL

## Checklist untuk GitHub + Railway

- [x] `README.md` dibuat
- [x] `.gitignore` sudah melindungi secret dan database lokal
- [x] `.github/workflows/deploy.yml` tersedia untuk CI/CD
- [x] konfigurasi `server.js` sudah mendukung `dotenv`, `helmet`, CORS, rate limiting

---

Terima kasih! Jika Anda ingin, saya juga bisa bantu membuat perintah `git remote add origin` dan contoh `railway init`/`railway up` secara spesifik untuk repo Anda.
