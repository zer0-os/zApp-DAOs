import type { zDAO, zDAOCollectibles } from '@zero-tech/zdao-sdk';
import type { WrappedCollectible, Asset } from '../types/dao';

import { useQuery } from 'react-query';
import { AssetType } from '@zero-tech/zdao-sdk';
import { useDaoAssetsCoins } from './useDaoAssetsCoins';

export const useDaoAssets = (dao?: zDAO) => {
	const { isLoading: isLoadingCoins, data: coinsData } = useDaoAssetsCoins(dao);

	const queryData = useQuery(
		['dao', 'assets', dao?.id],
		async () => {
			const collectibles: zDAOCollectibles = await dao.listAssetsCollectibles();
			const wrappedCollectibles: WrappedCollectible[] = collectibles.map(
				(c) => ({
					...c,
					type: AssetType.ERC721
				})
			);

			const allAssets: Asset[] = [
				...coinsData?.coins.filter((d) => d.amount !== '0'),
				...wrappedCollectibles
			];

			return allAssets;
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: Boolean(coinsData)
		}
	);

	return {
		...queryData,
		isLoading: queryData.isLoading || isLoadingCoins
	};
};
