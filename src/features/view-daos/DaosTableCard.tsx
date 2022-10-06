// Types import
import type { FC } from 'react';
import type { DAOTableDataItem } from './DaosTable.types';

// React import
import React from 'react';

// Hooks import
import { useDaosTableItemData } from './hooks';

type DaosTableCardProps = {
	daoData: DAOTableDataItem;
};

export const DaosTableCard: FC<DaosTableCardProps> = ({ daoData }) => {
	const { title, zna, imgAlt, imgSrc, usdValue, onClick } =
		useDaosTableItemData(daoData);

	// TODO:: This is mock render with real data to be used by zui grid card component
	return (
		<>
			<div onClick={onClick}>
				<img alt={imgAlt} src={imgSrc} />
				<div>
					<span>{title}</span>
					<span>{zna}</span>
				</div>
				<p>{usdValue}</p>
			</div>
		</>
	);
};
