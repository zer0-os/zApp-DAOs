import { test, expect } from '../../../fixtures';
import { ProposalsPage } from '../pages/proposals';

test.beforeEach(async ({ page }) => {
	const proposals = new ProposalsPage(page);
	await proposals.goto();
});

// @note: this is a fragile test, but it will do for now
test('can view a list of all proposals in a DAO', async ({ page }) => {
	await expect(page.getByText('Loading Proposals')).toBeVisible();
	await page.waitForSelector('[data-testid="zapp-daos-view-toggle"]');
	const viewToggle = page.getByTestId('zapp-daos-view-toggle');

	// list view
	await viewToggle.getByRole('radio').first().click();
	await expect(page.getByText("Let's Buy a GEN!")).toBeVisible();

	// grid view
	await viewToggle.getByRole('radio').last().click();
	await expect(
		page.getByText('This proposal is to gain funding for purchasing a Moto'),
	).toBeVisible();
});
