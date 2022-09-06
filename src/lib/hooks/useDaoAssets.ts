import type { zDAO, zDAOAssets } from '@zero-tech/zdao-sdk';
import type { Asset } from '../types/dao';

import { useQuery } from 'react-query';
import { AssetType } from '@zero-tech/zdao-sdk';

export const useDaoAssets = (dao?: zDAO) => {
	return useQuery(
		['dao-assets', dao?.id],
		async () => {
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
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: Boolean(dao)
		}
	);
};
