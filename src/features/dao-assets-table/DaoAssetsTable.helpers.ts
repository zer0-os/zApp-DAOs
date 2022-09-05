import type { Asset } from '../../lib/types/dao';
import type { DaoAssetTableDataItem } from './DaoAssetsTable.types';

import millify from 'millify';
import { formatUnits } from 'ethers/lib/utils';
import { formatFiat } from '../../lib/util/format';
import { USD } from '../../lib/constants/currency';
import { DAO_ASSET_MILIFY_OPTIONS } from './DaoAssetsTable.constants';
import defaultAssetIcon from '../../assets/default_asset.png';
import wildIcon from '../../assets/WWLogo-Padded.svg';

/**
 * Converts an Asset to AssetTableDataItem
 * @param asset to convert
 * @returns asset as AssetTableDataItem
 */
export const convertAsset = (asset: Asset): DaoAssetTableDataItem => {
	const a = asset as any;

	const amount = a.amount ?? 1;
	const symbol = a.symbol ?? a.tokenSymbol;
	const image =
		symbol === 'WILD'
			? wildIcon
			: a.metadata?.image ?? a.logoUri ?? defaultAssetIcon;

	return {
		amount,
		decimals: a.decimals ?? 0,
		image: image,
		key: amount + a.address,
		name: a.metadata?.name ?? a.metadata?.title ?? a.name ?? a.tokenName,
		subtext: a.symbol ?? a.tokenSymbol,
		amountInUSD: a.amountInUSD ? USD + formatFiat(a.amountInUSD) : '-'
	};
};

export const isZnsToken = (label: string): boolean => {
	return label.toLowerCase() === 'zns';
};

/**
 * Format a total amount of asset tokens
 * @param item to format
 * @returns formatted total ammount of asset tockens
 */
export const formatTotalAmountOfTokens = (
	item: DaoAssetTableDataItem
): string => {
	const { amount, decimals } = item;

	return millify(
		Number(formatUnits(amount, decimals)),
		DAO_ASSET_MILIFY_OPTIONS
	);
};
