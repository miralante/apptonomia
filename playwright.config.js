const { defineConfig } = require('playwright/test');

const port = Number(process.env.PORT || 4173);
const origin = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${port}`;

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120000,
  retries: 1,
  workers: 1,
  slowMo: 0,
  use: {
    baseURL: `${origin}/project/`,
    headless: true,
  },
  webServer: {
    command: 'node scripts/ui-server.js',
    port,
    timeout: 30000,
    reuseExistingServer: false,
  },
});
