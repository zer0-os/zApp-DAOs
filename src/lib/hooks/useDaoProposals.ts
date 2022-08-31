import type { zDAO, Proposal } from '@zero-tech/zdao-sdk';

import { useQuery } from 'react-query';

type UseDaoProposalsReturn = {
	proposals: Proposal[];
	isLoading: boolean;
};

export const useDaoProposals = (dao?: zDAO): UseDaoProposalsReturn => {
	// Query
	const { isLoading, data: proposals } = useQuery(
		`daos-${dao.id}-proposals`,
		async () => {
			try {
				return await dao.listProposals();
			} catch (e) {
				return [];
			}
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: Boolean(dao)
		}
	);

	return {
		isLoading,
		proposals
	};
};
