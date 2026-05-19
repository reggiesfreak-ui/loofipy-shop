# 🚀 LOOFIPY - Quick Start Production Guide

## 📋 Checklist Sebelum Production

### 1. Generate JWT Secret
```bash
node scripts/generate-secret.js
```
Copy output ke `.env.production`:
```
JWT_SECRET=<paste_generated_secret_here>
```

### 2. Setup Database (PostgreSQL)

Pilih salah satu:

#### A. Docker Compose (Recommended)
```bash
docker-compose up -d
```
Ini akan start PostgreSQL + API server

#### B. Cloud Database
- **Supabase**: https://supabase.com (Free tier available)
- **Railway**: https://railway.app (PostgreSQL included)
- **Neon**: https://neon.tech (Serverless PostgreSQL)

Update `.env.production`:
```
DATABASE_URL=postgresql://user:pass@host:5432/loofipy_db
```

### 3. Migrate Data (SQLite → PostgreSQL)
```bash
DATABASE_URL=<your_postgres_url> node scripts/migrate-to-postgres.js
```

### 4. Setup File Upload Storage

Pilih salah satu:

#### A. Cloudinary (Free 25GB)
```bash
npm install cloudinary
```
Update `.env.production`:
```
CLOUDINARY_URL=cloudinary://key:secret@cloud
```

#### B. AWS S3
```bash
npm install aws-sdk
```
Update `.env.production`:
```
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_S3_BUCKET=xxx
```

#### C. Local (Development only)
```
UPLOAD_DIR=/var/uploads
```

### 5. Test Lokal
```bash
NODE_ENV=production npm start
```

Verifikasi:
```bash
curl http://localhost:3000/api/health
```

---

## 🚀 Deployment Options

### Option 1: Docker (Any Server)

```bash
# Build image
docker build -t loofipy-api .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e JWT_SECRET=... \
  -e NODE_ENV=production \
  loofipy-api
```

### Option 2: Railway (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

Env vars auto-synced dari `.env.production`

### Option 3: Render

1. Push ke GitHub
2. Connect GitHub repo di Render
3. Set environment variables
4. Deploy → Auto deploy on push

### Option 4: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create loofipy-app

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main

# Set env vars
heroku config:set JWT_SECRET=xxx
heroku config:set DATABASE_URL=xxx
```

### Option 5: DigitalOcean App Platform

1. Connect GitHub repo
2. Create app
3. Set environment variables
4. Deploy

---

## 📊 Monitoring & Management

### PM2 (Process Manager)

```bash
npm install -g pm2

# Start
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# Logs
pm2 logs loofipy-api

# Save & startup
pm2 save
pm2 startup
```

### Viewing Logs

```bash
# Docker
docker logs -f loofipy-api

# PM2
pm2 logs

# File
tail -f logs/combined.log
tail -f logs/error.log
```

### Health Check

```bash
curl https://yourdomain.com/api/health
```

Response:
```json
{
  "success": true,
  "message": "Loofipy API berjalan!",
  "time": "2026-05-19T10:30:00.000Z"
}
```

---

## 🧪 Testing APIs

```bash
# Unit test
npm run test

# Test auth
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller@loofipy.com",
    "password": "seller123"
  }'

# Test rate limiting (6 requests dalam 15 menit)
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test"}'
done
```

---

## 📝 First Steps After Deployment

### 1. Change Admin Password
Login dengan credentials default:
- Email: `admin@loofipy.com`
- Password: `admin2024`

Update password di dashboard

### 2. Add Your Domain

Update environment variables:
```
CORS_ORIGIN=https://yourdomain.com
API_BASE_URL=https://api.yourdomain.com/api
```

### 3. Setup SSL/HTTPS

- Railway, Render, Heroku: Auto SSL
- DigitalOcean: Let's Encrypt
- Custom server: Certbot + Nginx

### 4. Configure Database Backups

```bash
# Backup PostgreSQL
pg_dump $DATABASE_URL > backup.sql

# Schedule via cron (Linux)
0 2 * * * pg_dump $DATABASE_URL > /backups/loofipy-$(date +\%Y\%m\%d).sql
```

### 5. Setup Monitoring & Alerts

- **Uptime**: UptimeRobot, Pingdom
- **Error tracking**: Sentry, Rollbar
- **Performance**: NewRelic, DataDog

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
lsof -i :3000
kill -9 <PID>
```

### Database Connection Error
```bash
# Test connection
psql $DATABASE_URL

# Check URL format
echo $DATABASE_URL
```

### CORS Error
```bash
# Update CORS_ORIGIN ke domain frontend Anda
CORS_ORIGIN=https://your-frontend.com npm start
```

### Out of Memory
```bash
# Increase memory limit
NODE_MAX_OLD_SPACE_SIZE=2048 npm start

# Docker
docker run -e NODE_OPTIONS="--max-old-space-size=2048" loofipy-api
```

---

## 📞 Quick Commands

```bash
# Generate secrets
npm run generate-secret

# Migrate database
npm run migrate-postgres

# Run tests
npm run test

# View logs
npm run logs

# Restart service
pm2 restart loofipy-api

# Docker commands
docker-compose up -d
docker-compose down
docker-compose logs -f api
docker-compose exec db psql -U loofipy_user -d loofipy_db
```

---

## 🔐 Security Checklist

- [x] JWT Secret random & strong (32+ chars)
- [x] Database password strong
- [x] HTTPS/SSL enabled
- [x] CORS origin restricted to domain
- [x] Rate limiting enabled
- [x] Helmet security headers
- [x] .env file in .gitignore
- [x] Database backups configured
- [x] Error logs monitored
- [x] Admin credentials changed

---

## 📚 Resources

- [Express.js Docs](https://expressjs.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Docker Docs](https://docs.docker.com/)
- [PM2 Docs](https://pm2.keymetrics.io/)
- [Supabase Docs](https://supabase.com/docs)

---

**Last Updated**: May 19, 2026
**Version**: 1.0.0
