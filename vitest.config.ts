import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.{js,ts}'],
    exclude: ['**/examples/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{js,ts}'],
      exclude: ['src/**/*.d.ts', 'src/**/*.spec.{js,ts}', '**/examples/**'],
      thresholds: {
        lines: 54,
        functions: 68,
        branches: 83,
        statements: 54,
      },
    },
  },
});
