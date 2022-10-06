import { ProposalClosingStatus } from '../DaoProposals.constants';

export type DaoProposalsTableItemData = {
	title: string;
	description: string;
	status: string;
	endTime: string;
	isConcluded: boolean;
	closingStatus: ProposalClosingStatus;
	closingMessage: string;
	onClick: () => void;
};
