import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

const TEST_PORT = 5173;

config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	timeout: 30 * 1000,
	expect: {
		timeout: 5000,
	},
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	workers: 1,
	reporter: 'html',
	use: {
		actionTimeout: 0,
		baseURL: `http://localhost:${TEST_PORT}`,
		trace: 'on-first-retry',
		headless: false,
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	webServer: {
		command: `npm run dev -- --port ${TEST_PORT}`,
		url: `http://127.0.0.1:${TEST_PORT}`,
		reuseExistingServer: !process.env.CI,
	},
});
