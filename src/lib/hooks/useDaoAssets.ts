import type { zDAO, zDAOAssets } from '@zero-tech/zdao-sdk';
import type { Asset } from '../types/dao';

import { useQuery } from 'react-query';
import { AssetType } from '@zero-tech/zdao-sdk';

type UseDaoAssetsReturn = {
	totalUsd?: number;
	assets: Asset[];
	isLoading: boolean;
};

export const useDaoAssets = (dao?: zDAO): UseDaoAssetsReturn => {
	// Query
	const { isLoading, data } = useQuery(
		`daos-${dao?.id}-assets`,
		async () => {
			try {
				const assets: zDAOAssets = await dao.listAssets();
				const collectibles = assets.collectibles.map((c) => ({
					...c,
					type: AssetType.ERC721
				}));

				const allAssets: Asset[] = [
					...assets.coins.filter((d) => d.amount !== '0'),
					...collectibles
				];

				return {
					totalUsd: assets.amountInUSD,
					assets: allAssets
				};
			} catch (e) {
				return {
					assets: []
				};
			}
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: Boolean(dao)
		}
	);

	return {
		isLoading,
		totalUsd: data?.totalUsd,
		assets: data?.assets
	};
};
