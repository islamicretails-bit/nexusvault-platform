module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['nexusvault-platform.netlify.app'],
  },
  async headers() {
    return [
      {
        source: '/:path*(svg|jpg|png|jpeg|gif|bmp|tiff|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*(css|js|json|txt)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*(html)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=60',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'same-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; object-src 'none'",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/:path*(index.html)',
        destination: '/:path*',
      },
    ];
  },
  experimental: {
    concurrentFeatures: true,
    serverComponents: true,
    runtime: 'nodejs',
    urlImports: ['https://cdn.jsdelivr.net'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');
const withTM = require('next-transpile-modules')([
  '@mui/material',
  '@mui/icons-material',
]);
module.exports = withPlugins([withImages, withTM], {
  reactStrictMode: true,
  images: {
    domains: ['nexusvault-platform.netlify.app'],
  },
  async headers() {
    return [
      {
        source: '/:path*(svg|jpg|png|jpeg|gif|bmp|tiff|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*(css|js|json|txt)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*(html)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=60',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'same-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; object-src 'none'",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/:path*(index.html)',
        destination: '/:path*',
      },
    ];
  },
  experimental: {
    concurrentFeatures: true,
    serverComponents: true,
    runtime: 'nodejs',
    urlImports: ['https://cdn.jsdelivr.net'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
});