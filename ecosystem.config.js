module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'quick-file',
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
    production: {
      user: 'ec2-user',
      host: 'ec2-13-229-88-236.ap-southeast-1.compute.amazonaws.com',
      key: '~/.ssh/AWS.pem',
      ref: 'origin/master',
      repo: 'git@github.com:SBeator/quick-file.git',
      path: '/var/www/quick-file',
      'post-deploy':
        'yarn install && pm2 reload ecosystem.config.js --env production',
    },
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
