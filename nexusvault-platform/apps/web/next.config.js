module.exports = {
  // Target serverless or static HTML
  target: 'serverless',
  // Internationalized Routing
  i18n: {
    locales: ['en', 'fr', 'es', 'de', 'zh'],
    defaultLocale: 'en',
  },
  // Images Optimization
  images: {
    domains: ['nexusvault-platform.com', 'localhost'],
  },
  // Optimize Fonts
  fontSources: [
    {
      name: 'Montserrat',
      url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&display=swap',
    },
  ],
  // Security Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: 'default-src \'self\'; script-src \'self\' https://cdn.jsdelivr.net; object-src \'none\'',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
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
            value: 'same-origin',
          },
        ],
      },
    ];
  },
  // Environment Variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },
  // Webpack Configuration
  webpack: (config, { buildId, dev, defaultLoaders, mode, target }) => {
    // Add custom webpack plugins and configurations here
    return config;
  },
  // Next.js Optimizations
  optimizeFonts: true,
  optimizeImages: true,
  optimizeCss: true,
  // Static HTML Export
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return defaultPathMap;
  },
};
// Custom Document for HTML Customization
import Document, { Html, Head, Main, NextScript } from 'next/document';

class CustomDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;