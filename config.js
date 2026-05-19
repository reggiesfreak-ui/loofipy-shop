/**
 * config.js
 * Configuration untuk development dan production
 */

const NODE_ENV = process.env.NODE_ENV || 'development';

const config = {
  development: {
    apiBaseUrl: 'http://localhost:3000/api',
    apiUrl: 'http://localhost:3000',
    corsOrigin: '*',
    jwtSecret: process.env.JWT_SECRET || 'loofipy_secret_key_2024',
    uploadDir: './uploads',
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },
  production: {
    apiBaseUrl: process.env.API_BASE_URL || 'https://api.loofipy.com/api',
    apiUrl: process.env.API_URL || 'https://api.loofipy.com',
    corsOrigin: process.env.CORS_ORIGIN || 'https://loofipy.com',
    jwtSecret: process.env.JWT_SECRET,
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'),
  },
};

// Export config untuk environment saat ini
module.exports = config[NODE_ENV];
