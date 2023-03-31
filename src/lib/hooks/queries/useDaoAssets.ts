import type { zDAOCollectibles } from '@zero-tech/zdao-sdk';
import type { WrappedCollectible, Asset } from '../../types/dao';

import { useQuery } from 'react-query';
import { AssetType } from '@zero-tech/zdao-sdk';
import { useDaoAssetsCoins } from './useDaoAssetsCoins';
import { useDao } from './useDao';

export const useDaoAssets = (zna?: string) => {
	const { data: dao, isLoading: isLoadingDao } = useDao(zna);
	const { data: assets, isLoading: isLoadingCoins } = useDaoAssetsCoins(zna);

	const queryData = useQuery(
		['dao', 'assets', { zna }],
		async () => {
			const collectibles: zDAOCollectibles = await dao.listAssetsCollectibles();
			const wrappedCollectibles: WrappedCollectible[] = collectibles.map(
				(c) => ({
					...c,
					type: AssetType.ERC721
				})
			);

			const allAssets: Asset[] = [
				...assets?.coins.filter((d) => d.amount !== '0'),
				...wrappedCollectibles
			];

			return allAssets;
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: Boolean(dao) && Boolean(assets)
		}
	);

	return {
		...queryData,
		isLoading: queryData.isLoading || isLoadingCoins || isLoadingDao
	};
};
