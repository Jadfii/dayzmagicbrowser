/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
];

module.exports = withPWA({
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV !== 'production',
    buildExcludes: [/middleware-manifest\.json$/],
  },
  runtime: 'edge',
  serverComponents: true,
  reactStrictMode: true,
  optimizeFonts: false,
  images: {
    loader: 'custom',
    domains: ['ik.imagekit.io', 'catamphetamine.gitlab.io'],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
});
