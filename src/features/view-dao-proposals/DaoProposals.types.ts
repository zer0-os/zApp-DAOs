import type { zDAO, Proposal } from '@zero-tech/zdao-sdk';

export type DaoProposalsTableProps = {
	isLoadingDao: boolean;
	dao?: zDAO;
};

export type DaoProposalsTableRowProps = {
	proposal: Proposal;
};
