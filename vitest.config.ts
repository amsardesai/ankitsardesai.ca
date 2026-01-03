import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['app/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['app/reducer.ts'],
    },
  },
});
