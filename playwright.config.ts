import { defineConfig } from '@playwright/test';

const API_BASE_URL = 'http://127.0.0.1:18080/api/v1';

export default defineConfig({
  testDir: './e2e/specs',
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  expect: {
    timeout: 7_000,
  },
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'node ./e2e/mock-auth-server.mjs',
      url: 'http://127.0.0.1:18080/health',
      reuseExistingServer: false,
      timeout: 30_000,
    },
    {
      command: 'npm run dev -- --hostname 127.0.0.1 --port 3000',
      env: {
        NEXT_PUBLIC_API_BASE_URL: API_BASE_URL,
        INTERNAL_API_BASE_URL: API_BASE_URL,
      },
      url: 'http://127.0.0.1:3000/en/login',
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
