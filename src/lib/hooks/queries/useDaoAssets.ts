import type { Asset, WrappedCollectible } from '../../types/dao';

import { useQuery } from 'react-query';
import { useDaoAssetsCoins } from './useDaoAssetsCoins';
import { useDao } from './useDao';
import { AssetType } from '@zero-tech/zdao-sdk';
import { useSafeUrl } from '../state/useSafeUrl';

export const useDaoAssets = (zna?: string) => {
	const { data: dao, isLoading: isLoadingDao } = useDao(zna);
	const { data: assets, isLoading: isLoadingCoins } = useDaoAssetsCoins(zna);
	const { safeUrl } = useSafeUrl();

	const queryData = useQuery(
		['dao', 'assets', { zna }],
		async () => {
			const response = await fetch(
				`${safeUrl}/api/v2/safes/${dao.safeAddress}/collectibles/?trusted=false&exclude_spam=true`,
			);
			const data = await response.json();

			const collectibles: WrappedCollectible[] = data.results.map(
				(collectible) => ({
					address: collectible.address,
					tokenName: collectible.tokenName,
					tokenSymbol: collectible.tokenSymbol,
					id: collectible.id,
					uri: collectible.uri,
					logoUri: collectible.logoUri,
					name: collectible.name,
					description: collectible.description,
					imageUri: collectible.imageUri,
					metadata: collectible.metadata,
					type: AssetType.ERC721,
				}),
			);

			const allAssets: Asset[] = [
				...(assets?.coins.filter((d) => d.amount !== '0') ?? []),
				...collectibles,
			];

			return allAssets;
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: Boolean(dao) && Boolean(assets),
		},
	);

	return {
		...queryData,
		isLoading: queryData.isLoading || isLoadingCoins || isLoadingDao,
	};
};
