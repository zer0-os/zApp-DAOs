import type { zDAO } from '@zero-tech/zdao-sdk';

import { useQuery } from 'react-query';
import { useWeb3 } from './useWeb3';

export const useAllDaosTotalPrice = (isLoadingDaos: boolean, daos?: zDAO[]) => {
	const { chainId } = useWeb3();

	return useQuery(
		['daos-all-total-price', chainId],
		async () => {
			const amounts = await Promise.all(
				daos?.map(async (d: zDAO) => {
					const assets = await d.listAssets();
					return assets?.amountInUSD;
				})
			);
			return amounts.filter(Boolean).reduce((a, b) => a + b, 0);
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: !isLoadingDaos && daos?.length > 0
		}
	);
};
