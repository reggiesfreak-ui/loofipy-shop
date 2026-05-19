/**
 * ecosystem.config.js
 * PM2 configuration untuk production deployment
 * 
 * Usage:
 * pm2 start ecosystem.config.js
 * pm2 save
 * pm2 startup
 */

module.exports = {
  apps: [
    {
      name: 'loofipy-api',
      script: './server.js',
      instances: 'max',
      exec_mode: 'cluster',
      
      // Environment
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },

      // Auto restart & monitoring
      autorestart: true,
      max_memory_restart: '500M',
      
      // Logs
      output: './logs/pm2-stdout.log',
      error: './logs/pm2-stderr.log',
      combine_logs: true,
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 5000,

      // File watching (auto restart on change)
      watch: false, // Set ke true untuk development
      ignore_watch: ['node_modules', 'logs', 'uploads'],

      // Max restart dalam 15 detik sebelum PM2 stop
      max_restarts: 10,
      min_uptime: '10s',

      // Health check
      health: {
        interval: 30000,
        path: '/api/health',
        timeout: 5000
      }
    }
  ],

  // Deployment configuration
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'https://github.com/yourusername/loofipy.git',
      path: '/var/www/loofipy',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-deploy-local': 'echo "Deploying to production server"'
    },
    staging: {
      user: 'ubuntu',
      host: 'your-staging-ip',
      ref: 'origin/develop',
      repo: 'https://github.com/yourusername/loofipy.git',
      path: '/var/www/loofipy-staging',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env staging'
    }
  }
};
