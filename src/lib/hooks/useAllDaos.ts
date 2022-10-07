import type { zNA } from '@zero-tech/zdao-sdk';

import { useQuery } from 'react-query';
import { useWeb3 } from './useWeb3';
import { useZdaoSdk } from './useZdaoSdk';

export const useAllDaos = (znas: zNA[]) => {
	const sdk = useZdaoSdk();
	const { chainId } = useWeb3();

	return useQuery(
		['daos-all', chainId],
		async () => {
			return await Promise.all(znas.map((zna) => sdk.getZDAOByZNA(zna)));
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: znas?.length > 0
		}
	);
};
