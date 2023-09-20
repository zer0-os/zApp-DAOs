import { useQuery } from 'react-query';

import { useCurrentProposal } from 'pages/proposal/lib/useCurrentProposal';
import { useWeb3 } from 'lib/hooks';

export const useUserVotePower = () => {
	const { data: proposal, proposalId } = useCurrentProposal();
	const { account } = useWeb3();

	return useQuery(
		['dao', 'proposal', 'power', { account, proposalId }],
		async () => {
			return proposal.getVotingPowerOfUser(account);
		},
		{
			enabled: Boolean(proposal) && Boolean(account),
		},
	);
};
