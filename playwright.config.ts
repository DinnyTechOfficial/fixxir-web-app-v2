import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  timeout: 120000,
  expect: { timeout: 15000 },
  use: { baseURL: 'http://127.0.0.1:3192', ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}), trace: 'retain-on-failure' },
  webServer: {
    command: 'npm run dev -- --hostname 127.0.0.1 --port 3192',
    url: 'http://127.0.0.1:3192/repair/track',
    env: { NEXT_PUBLIC_FIXXIR_API_URL: 'https://api.example.test' },
    reuseExistingServer: false,
    timeout: 60000,
  },
});
