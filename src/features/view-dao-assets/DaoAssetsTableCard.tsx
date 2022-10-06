import type { FC } from 'react';
import type { DaoAssetTableDataItem } from './DaoAssetsTable.types';

import React from 'react';
import { formatTotalAmountOfTokens } from './DaoAssetsTable.helpers';

type DaoAssetsTableCardProps = {
	data: DaoAssetTableDataItem;
};

export const DaoAssetsTableCard: FC<DaoAssetsTableCardProps> = ({ data }) => {
	const { image, name, subtext, amountInUSD, amount, decimals } = data;

	// TODO:: This is mock render with real data to be used by zui grid card component
	return (
		<>
			<div>
				<img alt={name} src={image} />

				<div>
					<span>{name}</span>
					<span>{subtext}</span>
				</div>
			</div>
			<div>{formatTotalAmountOfTokens(amount, decimals)}</div>
			<div>{amountInUSD}</div>
		</>
	);
};
