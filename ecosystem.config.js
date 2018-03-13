module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'quick-file2',
      script: './server.js',
      env: {
        COMMON_VARIABLE: 'true',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    'local-deploy': {
      user: 'ec2-user',
      host: 'localhost',
      ref: 'origin/master',
      repo: 'git@github.com:SBeator/quick-file.git',
      path: '/var/www/quick-file',
      'post-deploy':
        'yarn install && pm2 reload ecosystem.config.js --env production',
    },
  },
};
