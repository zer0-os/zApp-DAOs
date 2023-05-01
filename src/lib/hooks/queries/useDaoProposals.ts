import { useQuery } from 'react-query';
import { useDao } from './useDao';

export const useDaoProposals = (zna: string) => {
	const { data: dao, isLoading: isLoadingDao } = useDao(zna);

	const query = useQuery(
		['dao', 'proposals', { zna }],
		async () => {
			return await dao.listProposals();
		},
		{
			enabled: Boolean(dao) && Boolean(zna)
		}
	);

	return {
		...query,
		isLoading: query.isLoading || isLoadingDao
	};
};
