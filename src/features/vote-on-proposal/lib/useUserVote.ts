import { useQuery } from 'react-query';

import { useCurrentProposal } from 'pages/proposal/lib/useCurrentProposal';
import { useWeb3 } from 'lib/hooks';

export const useUserVote = () => {
	const { data: proposal, proposalId } = useCurrentProposal();
	const { account } = useWeb3();

	return useQuery(
		['dao', 'proposal', 'votes', { proposalId, account }],
		async () => {
			const votes = await proposal?.listVotes({ voter: account });
			return votes?.[0];
		},
		{ enabled: Boolean(proposal) && Boolean(account) },
	);
};
