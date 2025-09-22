module.exports = {
  apps: [
    {
      name: 'master-sps-backend',
      script: './backend/server.js',
      cwd: '/var/www/master_sps',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        DB_HOST: 'localhost',
        DB_PORT: 3306,
        DB_NAME: 'master_sps',
        DB_USER: 'master_user',
        DB_PASSWORD: 'master_password'
      },
      error_file: '/var/log/pm2/master-sps-backend-error.log',
      out_file: '/var/log/pm2/master-sps-backend-out.log',
      log_file: '/var/log/pm2/master-sps-backend.log',
      time: true,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
