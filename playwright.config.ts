import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 15_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  retries: 0,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    navigationTimeout: 30_000,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
})
