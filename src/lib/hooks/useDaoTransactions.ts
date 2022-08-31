import type { zDAO, Transaction } from '@zero-tech/zdao-sdk';

import { useQuery } from 'react-query';

type UseDaoTransactionsReturn = {
	transactions: Transaction[];
	isLoading: boolean;
};

export const useDaoTransactions = (dao?: zDAO): UseDaoTransactionsReturn => {
	// Query
	const { isLoading, data: transactions } = useQuery(
		`daos-${dao.id}-transactions`,
		async () => {
			try {
				return await dao.listTransactions();
			} catch (e) {
				return [];
			}
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: Boolean(dao)
		}
	);

	return {
		isLoading,
		transactions
	};
};
