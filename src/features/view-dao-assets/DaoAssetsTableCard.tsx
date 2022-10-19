import type { FC } from 'react';
import type { DaoAssetTableDataItem } from './DaoAssetsTable.types';

import React from 'react';
import { GridCard } from '@zero-tech/zui/components/GridCard';
import { NFT } from '@zero-tech/zui/components/GridCard/templates/NFT';

type DaoAssetsTableCardProps = {
	data: DaoAssetTableDataItem;
};

export const DaoAssetsTableCard: FC<DaoAssetsTableCardProps> = ({ data }) => {
	const { image, name, subtext, amountInUSD } = data;

	return (
		<GridCard
			aspectRatio={1}
			imageAlt={`${name ?? 'loading'} dao asset image`}
			imageSrc={image}
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
