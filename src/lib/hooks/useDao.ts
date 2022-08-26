import type { zDAO } from '@zero-tech/zdao-sdk';

import { useQuery } from 'react-query';
import { useZdaoSdk } from './useZdaoSdk';

type UseDaoReturn = {
	dao?: zDAO;
	isLoading: boolean;
};

export const useDao = (zna: string): UseDaoReturn => {
	const sdk = useZdaoSdk();

	// Query
	const { isLoading, data: dao } = useQuery(
		`dao-zna-${zna}`,
		async () => {
			try {
				return await sdk.getZDAOByZNA(zna);
			} catch (e) {
				return undefined;
			}
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: zna.trim().length > 0
		}
	);

	return {
		isLoading,
		dao
	};
};
