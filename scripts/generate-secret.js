#!/usr/bin/env node

/**
 * generate-secret.js
 * Generate secure JWT secret untuk production
 * 
 * Usage: node generate-secret.js
 */

const crypto = require('crypto');

function generateSecureSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

function generateProductionEnv() {
  const jwtSecret = generateSecureSecret();
  
  console.log('\n' + '='.repeat(60));
  console.log('🔐 LOOFIPY Production JWT Secret Generator');
  console.log('='.repeat(60));
  
  console.log('\n✅ Generated JWT Secret (copy ke .env):');
  console.log('\nJWT_SECRET=' + jwtSecret);
  
  console.log('\n' + '-'.repeat(60));
  console.log('📋 Gunakan secret di atas untuk .env production:');
  console.log('-'.repeat(60));
  
  console.log(`\n1. Buka file .env`);
  console.log(`2. Ganti JWT_SECRET dengan value di atas`);
  console.log(`3. Jangan commit .env ke git`);
  console.log(`4. Deploy ke production\n`);
}

generateProductionEnv();
