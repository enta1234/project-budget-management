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
