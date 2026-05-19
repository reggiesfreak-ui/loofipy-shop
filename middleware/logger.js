/**
 * middleware/logger.js
 * Winston logger configuration untuk production logging
 */

const winston = require('winston');
const path = require('path');
const fs = require('fs');

const NODE_ENV = process.env.NODE_ENV || 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Create logs directory jika belum ada
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Create logger
const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: logFormat,
  defaultMeta: { service: 'loofipy-api' },
  transports: [
    // File transport untuk error logs
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // File transport untuk semua logs
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ]
});

// Tambah console transport di development
if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
        return `${timestamp} [${level}]: ${message} ${metaStr}`;
      })
    )
  }));
}

// Express middleware untuk auto-log requests
const expressLogger = (req, res, next) => {
  // Log request
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Capture response
  const originalSend = res.send;
  res.send = function(data) {
    logger.info('Response sent', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime: `${Date.now() - req.startTime}ms`
    });
    return originalSend.call(this, data);
  };

  req.startTime = Date.now();
  next();
};

// Error logger
const errorLogger = (err, req, res, next) => {
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    statusCode: res.statusCode
  });
  next(err);
};

module.exports = {
  logger,
  expressLogger,
  errorLogger
};
