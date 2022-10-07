import type { zDAO } from '@zero-tech/zdao-sdk';

import { useQuery } from 'react-query';

export const useDaoProposals = (dao?: zDAO) => {
	return useQuery(
		['dao-proposals', dao?.id],
		async () => {
			return await dao.listProposals();
		},
		{
			enabled: Boolean(dao)
		}
	);
};
