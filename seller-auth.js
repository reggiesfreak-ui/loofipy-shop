/**
 * seller-auth.js  (VERSI BARU — menggunakan API backend nyata)
 * Semua autentikasi kini memanggil /api/auth/* dan /api/products/*
 */

// URL API otomatis menyesuaikan: lokal atau server online
const API_BASE = window.location.origin + '/api';
const TOKEN_KEY = 'loofipy_token';
const SESSION_KEY = 'loofipy_session';

// ─── TOKEN MANAGEMENT ─────────────────────────────────────────────────────────

function saveToken(token, seller) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(SESSION_KEY, JSON.stringify(seller));
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
  window.location.href = 'seller-login.html';
}

function requireAuth() {
  const token = getToken();
  const session = getSession();
  if (!token || !session) {
    window.location.href = 'seller-login.html';
    return null;
  }
  return session;
}

// ─── API HELPER ───────────────────────────────────────────────────────────────

async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  // Jangan set Content-Type jika FormData (biarkan browser yang set boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    if (options.body && typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
    }
  }

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

// ─── AUTH FUNCTIONS ───────────────────────────────────────────────────────────

async function apiLogin(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password }
  });
}

async function apiRegister(name, email, password, store_name) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: { name, email, password, store_name }
  });
}

// ─── PRODUCT FUNCTIONS ────────────────────────────────────────────────────────

async function getSellerProducts() {
  const res = await apiRequest('/products');
  return res.data.products || [];
}

async function addProduct(formData) {
  return apiRequest('/products', { method: 'POST', body: formData });
}

async function updateProduct(productId, formData) {
  return apiRequest(`/products/${productId}`, { method: 'PUT', body: formData });
}

async function deleteProduct(productId) {
  return apiRequest(`/products/${productId}`, { method: 'DELETE' });
}

// ─── LOGIN PAGE LOGIC ─────────────────────────────────────────────────────────
if (document.getElementById('login-form')) {
  // Jika sudah login, redirect
  if (getToken() && getSession()) {
    window.location.href = 'dashboard.html';
  }

  const form         = document.getElementById('login-form');
  const emailInput   = document.getElementById('email');
  const passInput    = document.getElementById('password');
  const emailError   = document.getElementById('email-error');
  const passError    = document.getElementById('password-error');
  const errorAlert   = document.getElementById('error-alert');
  const errorMsg     = document.getElementById('error-message');
  const successAlert = document.getElementById('success-alert');
  const submitBtn    = document.getElementById('submit-btn');
  const btnText      = document.getElementById('btn-text');
  const btnLoading   = document.getElementById('btn-loading');
  const togglePass   = document.getElementById('toggle-password');
  const eyeIcon      = document.getElementById('eye-icon');

  togglePass.addEventListener('click', () => {
    const isPass = passInput.type === 'password';
    passInput.type = isPass ? 'text' : 'password';
    eyeIcon.textContent = isPass ? 'visibility_off' : 'visibility';
  });

  [emailInput, passInput].forEach(el => {
    el.addEventListener('input', () => {
      el.classList.remove('error');
      emailError.classList.add('hidden');
      passError.classList.add('hidden');
      errorAlert.classList.add('hidden');
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = emailInput.value.trim().toLowerCase();
    const password = passInput.value;
    let valid = true;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailInput.classList.add('error'); emailError.classList.remove('hidden'); valid = false;
    }
    if (!password) {
      passInput.classList.add('error'); passError.classList.remove('hidden'); valid = false;
    }
    if (!valid) { form.classList.add('shake'); setTimeout(() => form.classList.remove('shake'), 500); return; }

    // Loading state
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    btnLoading.classList.add('flex');

    try {
      const result = await apiLogin(email, password);
      if (result.ok && result.data.token) {
        saveToken(result.data.token, result.data.seller);
        successAlert.classList.remove('hidden');
        setTimeout(() => window.location.href = 'dashboard.html', 1200);
      } else {
        throw new Error(result.data.message || 'Login gagal.');
      }
    } catch (err) {
      errorMsg.textContent = err.message;
      errorAlert.classList.remove('hidden');
      emailInput.classList.add('error');
      passInput.classList.add('error');
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
      submitBtn.disabled = false;
      btnText.classList.remove('hidden');
      btnLoading.classList.add('hidden');
      btnLoading.classList.remove('flex');
    }
  });
}

// ─── HELPER: Fill demo credentials ───────────────────────────────────────────
function fillDemo(email, password) {
  const e = document.getElementById('email');
  const p = document.getElementById('password');
  if (e && p) {
    e.value = email; p.value = password;
    ['error'].forEach(c => { e.classList.remove(c); p.classList.remove(c); });
    document.getElementById('email-error')?.classList.add('hidden');
    document.getElementById('password-error')?.classList.add('hidden');
    document.getElementById('error-alert')?.classList.add('hidden');
  }
}
