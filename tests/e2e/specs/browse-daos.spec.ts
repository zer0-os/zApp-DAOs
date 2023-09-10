import { test, expect } from '../../../fixtures';
import { DaosPage } from '../pages/daos';

test.beforeEach(async ({ page }) => {
	const daos = new DaosPage(page);
	await daos.goto();
});

// @note: this is a fragile test, but it will do for now
test('can view a list of all DAOs in the network in list and grid view', async ({
	page,
}) => {
	await expect(page.getByText('Loading all DAOs')).toBeVisible();
	await page.waitForSelector('[data-testid="zapp-daos-view-toggle"]');
	const viewToggle = page.getByTestId('zapp-daos-view-toggle');

	// list view
	await viewToggle.getByRole('radio').first().click();
	await expect(page.getByText('Wilder Beasts')).toBeVisible();
	await expect(page.getByText('Wilder Moto')).toBeVisible();
	await expect(page.getByText('Wilder Wheels')).toBeVisible();
	await expect(page.getByText('Wilder Kicks')).toBeVisible();

	// grid view
	await viewToggle.getByRole('radio').last().click();
	await expect(page.getByText('Wilder Beasts')).toBeVisible();
	await expect(page.getByText('Wilder Moto')).toBeVisible();
	await expect(page.getByText('Wilder Wheels')).toBeVisible();
	await expect(page.getByText('Wilder Kicks')).toBeVisible();
});
