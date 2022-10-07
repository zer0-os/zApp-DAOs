import type { zDAO } from '@zero-tech/zdao-sdk';

import { useQuery } from 'react-query';

export const useDaoTransactions = (dao?: zDAO) => {
	return useQuery(
		['dao-transactions', dao?.id],
		async () => {
			return await dao.listTransactions();
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: Boolean(dao)
		}
	);
};
