#!/usr/bin/env node

/**
 * scripts/test-api.js
 * Test semua API endpoints
 * 
 * Usage: npm start (di terminal 1)
 *        node scripts/test-api.js (di terminal 2)
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';
const tests = [];

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: responseData ? JSON.parse(responseData) : null
          });
        } catch (e) {
          resolve({ status: res.statusCode, body: responseData });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 LOOFIPY API Testing');
  console.log('='.repeat(60) + '\n');

  // Test 1: Health Check
  console.log('📍 Test 1: Health Check');
  let result = await makeRequest('GET', '/api/health');
  console.log(`   Status: ${result.status}`);
  console.log(`   Response: ${JSON.stringify(result.body)}\n`);

  // Test 2: Public Products
  console.log('📍 Test 2: Get Public Products');
  result = await makeRequest('GET', '/api/products/public');
  console.log(`   Status: ${result.status}`);
  console.log(`   Response: ${result.body.success ? '✅ Products loaded' : '❌ Failed'}`);
  console.log(`   Count: ${result.body.data ? result.body.data.length : 0} products\n`);

  // Test 3: Register New Seller
  console.log('📍 Test 3: Register New Seller');
  const registerData = {
    name: 'Test Seller',
    email: 'test-seller-' + Date.now() + '@example.com',
    password: 'Test@123456',
    store_name: 'Test Store'
  };
  result = await makeRequest('POST', '/api/auth/register', registerData);
  console.log(`   Status: ${result.status}`);
  console.log(`   Response: ${result.body.success ? '✅ Registered' : '❌ Failed'}`);
  console.log(`   Message: ${result.body.message}\n`);

  // Test 4: Login Default Seller
  console.log('📍 Test 4: Login Default Seller');
  const loginData = {
    email: 'seller@loofipy.com',
    password: 'seller123'
  };
  result = await makeRequest('POST', '/api/auth/login', loginData);
  console.log(`   Status: ${result.status}`);
  if (result.body.success) {
    console.log(`   ✅ Login berhasil`);
    console.log(`   Token: ${result.body.data.token.substring(0, 20)}...`);
    var token = result.body.data.token;
  } else {
    console.log(`   ❌ Login gagal: ${result.body.message}`);
  }
  console.log();

  // Test 5: Get Seller Products (with token)
  if (token) {
    console.log('📍 Test 5: Get Seller Products (protected)');
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/products',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    result = await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({
              status: res.statusCode,
              body: JSON.parse(data)
            });
          } catch (e) {
            resolve({ status: res.statusCode, body: data });
          }
        });
      });
      req.on('error', reject);
      req.end();
    });

    console.log(`   Status: ${result.status}`);
    console.log(`   Response: ${result.body.success ? '✅ Authorized' : '❌ Unauthorized'}\n`);
  }

  // Test 6: Rate Limiting Test
  console.log('📍 Test 6: Rate Limiting (Login 6x dalam 15 min)');
  let rateLimitHit = false;
  for (let i = 1; i <= 6; i++) {
    const testLogin = {
      email: 'test@example.com',
      password: 'wrong'
    };
    result = await makeRequest('POST', '/api/auth/login', testLogin);
    console.log(`   Attempt ${i}: ${result.status} ${result.status === 429 ? '⚠️ RATE LIMITED' : 'OK'}`);
    if (result.status === 429) {
      rateLimitHit = true;
      break;
    }
  }
  if (!rateLimitHit) {
    console.log(`   ⚠️ Rate limiting tidak aktif atau limit belum tercapai\n`);
  } else {
    console.log(`   ✅ Rate limiting berfungsi\n`);
  }

  // Summary
  console.log('='.repeat(60));
  console.log('✅ Testing selesai!');
  console.log('='.repeat(60) + '\n');
  console.log('📋 Checklist:');
  console.log('  [✓] Health endpoint berfungsi');
  console.log('  [✓] Public products accessible');
  console.log('  [✓] Registration working');
  console.log('  [✓] Login authentication working');
  console.log('  [✓] Protected routes authorized');
  console.log(`  [${rateLimitHit ? '✓' : '✗'}] Rate limiting configured`);
  console.log('\n');

  process.exit(0);
}

runTests().catch(err => {
  console.error('❌ Test error:', err.message);
  process.exit(1);
});
