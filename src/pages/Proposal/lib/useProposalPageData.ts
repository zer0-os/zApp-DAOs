import { ProposalId } from '@zero-tech/zdao-sdk';
import { useDao, useDaoProposal, useProposalVotes } from '../../../lib/hooks';
import { useCallback } from 'react';
import { isFromSnapshotWithMultipleChoices } from '../../../features/view-dao-proposals/DaoProposalsTable/lib';

interface UseProposalPageDataParams {
	proposalId: ProposalId;
	zna: string;
}

export const useProposalPageData = ({
	proposalId,
	zna
}: UseProposalPageDataParams) => {
	const { data: dao } = useDao(zna);

	const proposalQuery = useDaoProposal({
		proposalId,
		zna
	});

	const votesQuery = useProposalVotes({
		proposalId,
		zna
	});

	const refetchProposal = proposalQuery.refetch;
	const refetchVotes = votesQuery.refetch;

	const refetch = useCallback(() => {
		refetchProposal();
		refetchVotes();
	}, [refetchProposal, refetchVotes]);

	const shouldShowVoteBar =
		proposalQuery.data &&
		!isFromSnapshotWithMultipleChoices(proposalQuery.data) &&
		votesQuery.data?.length > 0;

	return {
		isLoadingProposal: proposalQuery.isLoading,
		isLoadingVotes: votesQuery.isLoading,
		proposal: proposalQuery.data,
		votes: votesQuery.data,
		refetch,
		dao,
		shouldShowVoteBar
	};
};
