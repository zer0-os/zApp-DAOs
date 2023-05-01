import React from 'react';
import type { FC } from 'react';

import { GridCard } from '@zero-tech/zui/components/GridCard';
import { NFT } from '@zero-tech/zui/components/GridCard/templates/NFT';
import { convertAssetImage } from './lib/helpers';
import type { DaoAssetTableDataItem } from './DaoAssetsTable';

///////////////////////////
// DAO Assets Table Card //
///////////////////////////

export interface DaoAssetsTableCardProps {
	data: DaoAssetTableDataItem;
}

export const DaoAssetsTableCard: FC<DaoAssetsTableCardProps> = ({ data }) => {
	const { image, name, subtext, amountInUSD } = data;
	const { src } = convertAssetImage(image);

	return (
		<GridCard
			aspectRatio={1}
			imageAlt={`${name ?? 'loading'} dao asset image`}
			imageSrc={src}
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
