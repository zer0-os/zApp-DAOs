import type { zDAO, zNA } from '@zero-tech/zdao-sdk';

import { useQuery } from 'react-query';
import { useWeb3 } from './useWeb3';
import { useAllDaos } from './useAllDaos';

type UseAllDaosTotalPriceReturn = {
	totalUsd?: number;
	isLoading: boolean;
};

export const useAllDaosTotalPrice = (
	znas: zNA[],
): UseAllDaosTotalPriceReturn => {
	const { chainId } = useWeb3();

	const { isLoading: isLoadingDaos, daos } = useAllDaos(znas);

	// Query
	const { isLoading, data: totalUsd } = useQuery(
		`get-all-daos-total-price-${chainId}`,
		async () => {
			try {
				const amounts = await Promise.all(
					daos.map(async (d: zDAO) => {
						const assets = await d.listAssets();
						return assets?.amountInUSD;
					}),
				);
				return amounts.filter(Boolean).reduce((a, b) => a + b, 0);
			} catch (e) {
				return;
			}
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: daos.length > 0,
		},
	);

	return {
		isLoading: isLoading || isLoadingDaos,
		totalUsd,
	};
};
