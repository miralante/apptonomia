const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120000,
  retries: 1,
  workers: 1,
  slowMo: 0,
  use: {
    baseURL: 'http://127.0.0.1:4173/project/',
    headless: true,
  },
  webServer: {
    command: 'node scripts/ui-server.js',
    port: 4173,
    timeout: 30000,
    reuseExistingServer: true,
  },
});
