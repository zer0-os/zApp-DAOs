import { test, expect } from '../../../fixtures';
import { ProposalPage } from '../pages/proposal';

test.beforeEach(async ({ page }) => {
	const proposals = new ProposalPage(
		page,
		'0.wilder.beasts',
		'0x6ea2cf6b25fde4e64a001ba7536926ab2e7de514e07652707009474af1154d25',
	);
	await proposals.goto();
});

// @note: this is a fragile test, but it will do for now
test('can view all proposal info on proposal page', async ({ page }) => {
	await expect(page.getByText("Let's Buy a GEN!")).toBeVisible({
		timeout: 120000,
	});

	// Check proposal info cards
	await expect(page.getByText('Votes Submitted12')).toBeVisible(); // Votes submitted
	await expect(page.getByText('StatusApproved')).toBeVisible(); // Vote status
	await expect(page.getByText('Voting SystemSingle Choice')).toBeVisible(); // Vote mechanism
	await expect(
		page.getByText('Execution CriteriaAbsolute Majority'),
	).toBeVisible(); // Execution criteria
	await expect(page.getByText('Creator0x78...91bF')).toBeVisible(); // Creator
	await expect(page.getByText('Time Remaining-')).toBeVisible(); // Time remaining

	// Check proposal body
	await expect(
		page.getByText(
			'This proposal is to gain funding for purchasing a Moto and Whip',
		),
	).toBeVisible(); // description
});
