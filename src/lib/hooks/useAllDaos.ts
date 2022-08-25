import type { zDAO, zNA } from '@zero-tech/zdao-sdk';

import { useQuery } from 'react-query';
import { useWeb3 } from './useWeb3';
import { useZdaoSdk } from './useZdaoSdk';

type UseAllDaosReturn = {
	daos: zDAO[];
	isLoading: boolean;
};

export const useAllDaos = (znas: zNA[]): UseAllDaosReturn => {
	const sdk = useZdaoSdk();
	const { chainId } = useWeb3();

	// Query
	const { isLoading, data: daos = [] } = useQuery(
		`daos-all-${chainId}`,
		async () => {
			try {
				return await Promise.all(znas.map((zna) => sdk.getZDAOByZNA(zna)));
			} catch (e) {
				return [];
			}
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: znas.length > 0,
		},
	);

	return {
		isLoading,
		daos,
	};
};
