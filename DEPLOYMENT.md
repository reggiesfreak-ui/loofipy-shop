# 🚀 LOOFIPY - Production Deployment Guide

## ✅ Sebelum Deployment

### 1. Setup Environment Variables

Buat file `.env` di root project:

```env
# Server
NODE_ENV=production
PORT=3000

# JWT Secret (GENERATE RANDOM STRING - JANGAN GUNAKAN YANG DI .env.example)
JWT_SECRET=your_super_secret_random_key_here_min_32_chars

# Database
DATABASE_PATH=./loofipy.db

# Upload Settings
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# CORS
CORS_ORIGIN=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. Install Dependencies

```bash
npm install
```

Pastikan semua dependencies terinstall:
- `dotenv` - Environment variables
- `express-rate-limit` - Rate limiting
- `helmet` - Security headers

### 3. Build & Test Lokal

```bash
# Test dengan NODE_ENV=development
npm start

# Jika berjalan tanpa error di http://localhost:3000
# Maka siap untuk production
```

---

## 📋 Deployment Checklist

### A. Security Issues

- [x] JWT Secret tidak hardcoded (gunakan .env)
- [x] CORS origin konfigurable
- [x] Helmet security headers enabled
- [x] Rate limiting untuk auth endpoints
- [x] .gitignore exclude .env dan database

### B. Database

**CURRENT**: SQLite file-based (tidak cocok production)

**RECOMMENDED**: Gunakan cloud database:

#### Opsi 1: Supabase (PostgreSQL)
```bash
npm install pg
```

Update `database.js`:
```javascript
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
```

#### Opsi 2: Railway
- Connect dengan GitHub
- Auto deploy on push
- PostgreSQL included

#### Opsi 3: Neon
- Serverless PostgreSQL
- Free tier tersedia

### C. File Upload Storage

**CURRENT**: Local `uploads/` folder (data hilang saat deploy)

**RECOMMENDED**: Cloud storage

#### Opsi 1: Cloudinary
```bash
npm install cloudinary multer-storage-cloudinary
```

#### Opsi 2: AWS S3
```bash
npm install aws-sdk
```

#### Opsi 3: Firebase Storage
```bash
npm install firebase-admin
```

### D. Hosting Platform

#### Opsi 1: Railway (Recommended)
```bash
npm install -g railway
railway link
railway up
```

#### Opsi 2: Render
- Connect GitHub repo
- Auto deploy on push
- Set environment variables di dashboard

#### Opsi 3: Heroku
```bash
npm install -g heroku
heroku login
heroku create loofipy-app
git push heroku main
```

#### Opsi 4: DigitalOcean App Platform
- Connect GitHub
- Configure env variables
- Deploy

---

## 🔄 CI/CD Setup (Optional)

### GitHub Actions Example

Buat `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - name: Deploy
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
        run: npm run deploy
```

---

## 🔐 Production Best Practices

### 1. Environment Variables Checklist

```bash
✓ JWT_SECRET          → Unique random string
✓ DATABASE_URL        → Cloud database URL
✓ NODE_ENV           → Set to 'production'
✓ CORS_ORIGIN        → Your domain only
✓ PORT               → Host port assignment
```

### 2. Database Backup

```bash
# Backup sebelum production
pg_dump $DATABASE_URL > backup.sql

# Restore jika diperlukan
psql $DATABASE_URL < backup.sql
```

### 3. Monitoring & Logging

```bash
npm install winston

# In server.js
const logger = require('winston');
app.use(logger.middleware);
```

### 4. API Rate Limiting

✓ Already implemented:
- Auth endpoints: 5 requests/15 min
- General API: 100 requests/15 min
- Upload: 50 uploads/hour

### 5. SSL/HTTPS

Set di hosting provider:
- Railway: Auto SSL
- Render: Auto SSL
- Heroku: Auto SSL

### 6. Domain Setup

```bash
# Update CORS_ORIGIN in .env
CORS_ORIGIN=https://yourdomain.com

# Update database allowed hosts (jika cloud DB)
# Add IP address di database firewall
```

---

## 📊 Monitoring Commands

```bash
# Check CPU & Memory
npm install pm2
pm2 start server.js --name "loofipy"
pm2 monit

# Logs
pm2 logs loofipy

# Restart on crash
pm2 start server.js --autorestart
```

---

## 🧪 Testing Production

```bash
# Cek health endpoint
curl https://yourdomain.com/api/health

# Test auth
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Check rate limiting (request 6x dalam 15 min)
for i in {1..6}; do
  curl https://yourdomain.com/api/auth/login
done
```

---

## 📋 Database Migration (SQLite → PostgreSQL)

### 1. Export dari SQLite

```bash
sqlite3 loofipy.db .dump > schema.sql
```

### 2. Create di PostgreSQL

```bash
psql -U postgres -d loofipy_db -f schema.sql
```

### 3. Migrate data

```javascript
// migrate.js
const sqlite3 = require('sqlite3');
const { Pool } = require('pg');

// Read from SQLite, Write to PostgreSQL
// (Implementasi sesuai schema)
```

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
lsof -i :3000
kill -9 <PID>
```

### Permission Denied (uploads)
```bash
chmod -R 755 uploads/
```

### Database Connection Error
```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### CORS Error
```bash
# Pastikan CORS_ORIGIN sesuai dengan frontend domain
# Update di .env
CORS_ORIGIN=https://your-frontend-domain.com
```

---

## 📝 Post-Deployment

1. Update admin credentials
```bash
# Login dengan default:
# Email: admin@loofipy.com
# Password: admin2024

# Ubah password di seller dashboard
```

2. Verify API endpoints
```bash
GET /api/health
POST /api/auth/login
GET /api/products/public
```

3. Monitor error logs
```bash
# Di hosting provider dashboard
# atau via PM2
pm2 logs
```

---

## 🎯 Quick Start Commands

```bash
# Development
npm start

# Production (local test)
NODE_ENV=production npm start

# Deploy ke Railway
railway up

# Deploy ke Heroku
git push heroku main

# Deploy ke Render
git push origin main  # (auto deploy configured)
```

---

## 📞 Support

- GitHub Issues
- Email: support@loofipy.com
- Docs: [Add your docs link]

---

**Last Updated**: May 19, 2026
**Version**: 1.0.0
