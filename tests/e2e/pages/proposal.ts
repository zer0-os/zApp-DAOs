import { type Page } from '@playwright/test';

export class ProposalPage {
	readonly page: Page;
	daoZna: string;
	proposalId: string;

	constructor(page: Page, daoZna: string, proposalId: string) {
		this.page = page;
		this.daoZna = daoZna;
		this.proposalId = proposalId;
	}

	async goto() {
		await this.page.goto(`/${this.daoZna}/daos/proposals/${this.proposalId}`);
	}
}
