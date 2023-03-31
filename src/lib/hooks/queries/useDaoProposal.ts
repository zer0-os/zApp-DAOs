import { useQuery } from 'react-query';
import { useDao } from './useDao';

interface UseDaoProposalParams {
	zna: string;
	proposalId: string;
}

export const useDaoProposal = ({ zna, proposalId }: UseDaoProposalParams) => {
	const { data: dao, isLoading: isLoadingDao } = useDao(zna);

	const query = useQuery(
		['dao', 'proposal', { proposalId, zna }],
		async () => {
			return await dao.getProposal(proposalId);
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: Boolean(dao) && Boolean(proposalId)
		}
	);

	return {
		...query,
		isLoading: query.isLoading || isLoadingDao
	};
};
