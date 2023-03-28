import type { Proposal } from '@zero-tech/zdao-sdk';

import { useQuery } from 'react-query';
import { useWeb3 } from './useWeb3';
import { useProposalVotes } from './useProposalVotes';

export const useUserProposalVoteData = (proposal?: Proposal) => {
	const { account } = useWeb3();
	const { isLoading: isLoadingVotes, data: votes } = useProposalVotes(proposal);

	const userVote = votes?.find(
		(vote) => vote.voter?.toLowerCase() === account?.toLowerCase()
	)?.choice;

	const { isLoading, ...rest } = useQuery(
		['user-proposal-vote-data', proposal?.id],
		async () => {
			const userVotingPower = await proposal.getVotingPowerOfUser(account);
			return { userVote, userVotingPower };
		},
		{
			enabled: Boolean(proposal) && Boolean(account) && !isLoadingVotes
		}
	);

	return { isLoading: isLoading || isLoadingVotes, ...rest };
};
