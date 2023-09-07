import { type Locator, type Page } from '@playwright/test';
import * as metamask from '@synthetixio/synpress/commands/metamask';

export class Controls {
	readonly controls: Locator;

	constructor(page: Page) {
		this.controls = page.getByTestId('zapp-dev-controls');
	}

	async connectWallet() {
		await this.controls.getByRole('button', { name: 'Connect' }).click();
		await metamask.acceptAccess();
	}
}
