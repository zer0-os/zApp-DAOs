import type { zNA } from '@zero-tech/zdao-sdk';

import { useQuery } from 'react-query';
import { useWeb3 } from './useWeb3';
import { useZdaoSdk } from './useZdaoSdk';

type UseAllZnasReturn = {
	znas: zNA[];
	isLoading: boolean;
};

export const useAllZnas = (): UseAllZnasReturn => {
	const sdk = useZdaoSdk();
	const { chainId } = useWeb3();

	// Query
	const { isLoading, data: znas = [] } = useQuery(
		`get-all-znas-${chainId}`,
		async () => {
			try {
				return await sdk.listZNAs();
			} catch (e) {
				return [];
			}
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
		},
	);

	return {
		isLoading,
		znas,
	};
};
