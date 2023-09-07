import { useQuery } from 'react-query';
import { useDao } from './useDao';

export const useDaoTransactions = (zna?: string) => {
	const { data: dao, isLoading } = useDao(zna);

	const query = useQuery(
		['dao', 'transactions', { zna }],
		async () => {
			return await dao.listTransactions();
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: Boolean(dao) && Boolean(zna),
		},
	);

	return {
		...query,
		isLoading: isLoading || query.isLoading,
	};
};
