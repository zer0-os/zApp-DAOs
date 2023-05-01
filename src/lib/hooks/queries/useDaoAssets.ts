import type { Asset } from '../../types/dao';

import { useQuery } from 'react-query';
import { useDaoAssetsCoins } from './useDaoAssetsCoins';
import { useDao } from './useDao';

export const useDaoAssets = (zna?: string) => {
	const { data: dao, isLoading: isLoadingDao } = useDao(zna);
	const { data: assets, isLoading: isLoadingCoins } = useDaoAssetsCoins(zna);

	const queryData = useQuery(
		['dao', 'assets', { zna }],
		async () => {
			// @note 25/04/2023 commented this out as collectible query is failing
			// const collectibles: zDAOCollectibles = await dao.listAssetsCollectibles();
			// const wrappedCollectibles: WrappedCollectible[] = collectibles.map(
			// 	(c) => ({
			// 		...c,
			// 		type: AssetType.ERC721
			// 	})
			// );
			//
			const allAssets: Asset[] = [
				...assets?.coins.filter((d) => d.amount !== '0')
				// ...wrappedCollectibles
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
