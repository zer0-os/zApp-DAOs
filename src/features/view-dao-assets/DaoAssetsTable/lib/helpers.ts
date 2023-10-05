import millify from 'millify';
import { formatUnits } from 'ethers/lib/utils';
import { getHashFromIpfsUrl } from '@zero-tech/zapp-utils/utils/ipfs';
import { getCloudinaryImageUrlFromIpfsUrl } from '@zero-tech/zapp-utils/utils/cloudinary';
import { formatFiat } from 'lib/util/format';
import { DOLLAR_SYMBOL } from 'lib/constants/currency';
import type { Asset } from 'lib/types/dao';

import type { DaoAssetTableDataItem } from '../DaoAssetsTable';

import defaultAssetIcon from '../../../../assets/default_asset.png';
import wildIcon from '../../../../assets/WWLogo-Padded.svg';

const DAO_ASSETS_MILLIFY_OPTIONS = {
	precision: 5,
	lowercase: false,
};

/**
 * Converts an Asset to AssetTableDataItem
 * @param asset to convert
 * @returns asset as AssetTableDataItem
 */
export const convertAsset = (asset: Asset): DaoAssetTableDataItem => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const a = asset as any;

	const amount = a.amount ?? 1;
	const symbol = a.symbol ?? a.tokenSymbol;
	const image =
		symbol === 'WILD'
			? wildIcon
			: a.metadata?.image ?? a.logoUri ?? defaultAssetIcon;

	const name = a.metadata?.name ?? a.metadata?.title ?? a.name ?? a.tokenName;
	const subtext = a.symbol ?? a.tokenSymbol;

	return {
		amount,
		decimals: a.decimals ?? 0,
		image: image,
		id: a.metadata?.image ?? a.logoUri,
		key: amount + a.address,
		name: name === 'ZERO' ? 'MEOW' : name,
		subtext: subtext === 'ZERO' ? 'MEOW' : subtext,
		amountInUSD: a.amountInUSD
			? DOLLAR_SYMBOL + formatFiat(a.amountInUSD)
			: '-',
	};
};

/**
 * Format a total amount of asset tokens
 * @param amount - string or number
 * @param decimals - number
 * @returns formatted total ammount of asset tockens
 */
export const formatTotalAmountOfTokens = (
	amount: string | number,
	decimals?: number,
): string => {
	return millify(
		Number(formatUnits(amount, decimals)),
		DAO_ASSETS_MILLIFY_OPTIONS,
	);
};

export const convertAssetImage = (image: string) => {
	const isIpfsUrl = Boolean(getHashFromIpfsUrl(image));

	if (isIpfsUrl) {
		return {
			isIpfsUrl,
			src: getCloudinaryImageUrlFromIpfsUrl(image, { size: 'medium' }),
		};
	} else {
		return {
			isIpfsUrl,
			src: image && image.startsWith('/') ? location.origin + image : image,
		};
	}
};
