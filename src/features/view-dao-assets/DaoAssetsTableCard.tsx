import type { FC } from 'react';
import type { DaoAssetTableDataItem } from './DaoAssetsTable.types';

import React from 'react';
import { getCloudinaryImageUrlFromIpfsUrl } from '@zero-tech/zapp-utils/utils/cloudinary';
import { getHashFromIpfsUrl } from '@zero-tech/zapp-utils/utils/ipfs';
import { GridCard } from '@zero-tech/zui/components/GridCard';
import { NFT } from '@zero-tech/zui/components/GridCard/templates/NFT';

type DaoAssetsTableCardProps = {
	data: DaoAssetTableDataItem;
};

export const DaoAssetsTableCard: FC<DaoAssetsTableCardProps> = ({ data }) => {
	const { image, name, subtext, amountInUSD } = data;

	const isIpfsUrl = Boolean(getHashFromIpfsUrl(image));
	const src = image && image.startsWith('/') ? location.origin + image : image;

	return (
		<GridCard
			aspectRatio={1}
			imageAlt={`${name ?? 'loading'} dao asset image`}
			imageSrc={
				isIpfsUrl
					? getCloudinaryImageUrlFromIpfsUrl(image, { size: 'medium' })
					: src
			}
		>
			<NFT
				title={name}
				zna={subtext}
				label={'Value (USD)'}
				primaryText={amountInUSD}
				secondaryText={null}
			/>
		</GridCard>
	);
};
