import { type Page } from '@playwright/test';

export class DaosPage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async goto() {
		await this.page.goto('/0.wilder/daos');
	}
}
