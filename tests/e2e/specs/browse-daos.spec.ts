import { test, expect } from '../../../fixtures';
import { DaosPage } from '../pages/daos';

test.beforeEach(async ({ page }) => {
	const daos = new DaosPage(page);
	await daos.goto();
});

test('can view a list of all DAOs in the network in list and grid view', async ({
	page,
}) => {
	// Should see "Loading DAOs" message
	await expect(page.getByText('Loading all DAOs')).toBeVisible();

	const viewToggle = page.getByTestId('zapp-daos-view-toggle');

	// Click first toggle option
	await viewToggle.getByRole('radio').first().click();

	// Should see all Wilder DAOs
	// @note: this is a fragile test, but it will do for now
	await expect(page.getByText('Wilder Beasts')).toBeVisible();
	await expect(page.getByText('Wilder Moto')).toBeVisible();
	await expect(page.getByText('Wilder Wheels')).toBeVisible();
	await expect(page.getByText('Wilder Kicks')).toBeVisible();

	// Click first toggle option
	await viewToggle.getByRole('radio').last().click();

	// Should see all Wilder DAOs
	// @note: this is a fragile test, but it will do for now
	await expect(page.getByText('Wilder Beasts')).toBeVisible();
	await expect(page.getByText('Wilder Moto')).toBeVisible();
	await expect(page.getByText('Wilder Wheels')).toBeVisible();
	await expect(page.getByText('Wilder Kicks')).toBeVisible();
});
