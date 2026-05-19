# Multi-stage Dockerfile untuk Loofipy E-Commerce
# Build stage dan production stage

# ─── Build Stage ───
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# ─── Production Stage ───
FROM node:18-alpine

# Set labels
LABEL maintainer="loofipy@example.com"
LABEL description="Loofipy E-Commerce API Server"

WORKDIR /app

# Copy dari builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application files
COPY . .

# Create necessary directories
RUN mkdir -p logs uploads

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Start application
CMD ["node", "server.js"]
