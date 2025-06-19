const path = require('path');
const dotenv = require('dotenv');

const envFile = path.join(__dirname, 'env', `${process.env.NODE_ENV || 'local'}.env`);
dotenv.config({ path: envFile });

const SERVICE_URL = process.env.SERVICE_URL || 'http://localhost:3000';

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${SERVICE_URL}/api/:path*`,
      },
    ];
  },
};
