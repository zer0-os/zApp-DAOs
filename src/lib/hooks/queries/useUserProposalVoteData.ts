import { useQuery } from 'react-query';
import { useDaoProposal, useWeb3 } from '../';
import { useProposalVotes } from './useProposalVotes';

interface UseUserProposalVoteDataParams {
	zna: string;
	proposalId: string;
}

export const useUserProposalVoteData = ({
	zna,
	proposalId,
}: UseUserProposalVoteDataParams) => {
	const { account } = useWeb3();

	const { data: proposal } = useDaoProposal({ zna, proposalId });
	const { isLoading: isLoadingVotes, data: votes } = useProposalVotes({
		zna,
		proposalId,
	});

	const userVote = votes?.find(
		(vote) => vote.voter?.toLowerCase() === account?.toLowerCase(),
	)?.choice;

	const { isLoading, ...rest } = useQuery(
		['user-proposal-vote-data', { account, proposalId }],
		async () => {
			const userVotingPower = await proposal.getVotingPowerOfUser(account);
			return { userVote, userVotingPower };
		},
		{
			enabled: Boolean(proposal) && Boolean(account) && !isLoadingVotes,
		},
	);

	return { isLoading: isLoading || isLoadingVotes, ...rest };
};
