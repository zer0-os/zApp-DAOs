import { useQuery } from 'react-query';
import { useDaoProposal } from './useDaoProposal';

interface UseDaoProposalParams {
	zna: string;
	proposalId: string;
}

export const useProposalVotes = ({ zna, proposalId }: UseDaoProposalParams) => {
	const { data: proposal, isLoading: isLoadingProposal } = useDaoProposal({
		zna,
		proposalId,
	});

	const query = useQuery(
		['dao', 'proposal', 'votes', { zna, proposalId }],
		async () => {
			return await proposal.listVotes({ from: 0, count: 2 });
		},
		{
			enabled: Boolean(proposal),
		},
	);

	return {
		...query,
		isLoading: isLoadingProposal || query.isLoading,
	};
};
