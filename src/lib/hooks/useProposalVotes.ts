import type { Proposal } from '@zero-tech/zdao-sdk';

import { useQuery } from 'react-query';

export const useProposalVotes = (proposal?: Proposal) => {
	return useQuery(
		['dao-proposal-votes', proposal?.id],
		async () => {
			return await proposal?.listVotes();
		},
		{
			enabled: Boolean(proposal)
		}
	);
};
