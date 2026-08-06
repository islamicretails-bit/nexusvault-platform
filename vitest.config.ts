import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./setupTests.ts'],
    coverage: {
      reporter: ['text', 'json', 'lcov', 'clover'],
      include: ['packages/core/src/**/*.{ts,js}'],
      exclude: ['**/node_modules/**', '**/*.test.{ts,js}', '**/setupTests.ts'],
    },
  },
});