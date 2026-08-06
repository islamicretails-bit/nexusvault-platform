import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./setupTests.ts'],
    coverage: {
      reporter: ['text', 'json', 'lcov', 'clover'],
      include: ['apps/web/**/*.{ts,tsx}'],
      exclude: ['node_modules/', 'apps/web/pages/api/**/*.{ts,tsx}'],
    },
    threads: false,
    watch: false,
    passWithNoTests: true,
    clearMocks: true,
    restoreMocks: true,
  },
  resolve: {
    alias: {
      '@apps/web': './apps/web',
      '@packages/core': './packages/core',
    },
  },
  define: {
    __DEV__: process.env.NODE_ENV !== 'production',
  },
});