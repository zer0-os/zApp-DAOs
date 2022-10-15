import type { zDAO } from '@zero-tech/zdao-sdk';

import { useQuery } from 'react-query';

export const useDaoAssetsCoins = (dao?: zDAO) => {
	return useQuery(
		['dao', 'total', dao?.id],
		async () => {
			return await dao.listAssetsCoins();
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: Boolean(dao)
		}
	);
};
