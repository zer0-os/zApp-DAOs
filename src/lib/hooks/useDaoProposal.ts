import type { zDAO, ProposalId } from '@zero-tech/zdao-sdk';

import { useQuery } from 'react-query';

export const useDaoProposal = (id: ProposalId, dao?: zDAO) => {
	return useQuery(
		['dao-proposal', id],
		async () => {
			return await dao.getProposal(id);
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: Boolean(dao) && Boolean(id)
		}
	);
};
