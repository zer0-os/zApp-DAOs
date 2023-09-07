import { test } from '../../../fixtures';
import { DaosPage } from '../pages/daos';

test.beforeEach(async ({ page }) => {
	const daos = new DaosPage(page);
	await daos.goto();
});

test('can unstake tokens from a deposit', async ({ page }) => {
	await page.getByText('Loading DAOs');
});
