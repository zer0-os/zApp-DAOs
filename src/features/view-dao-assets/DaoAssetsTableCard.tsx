import type { FC } from 'react';
import type { DaoAssetTableDataItem } from './DaoAssetsTable.types';

import React from 'react';
import { GridCard } from '@zero-tech/zui/components/GridCard';
import { TextStack } from '@zero-tech/zui/components/TextStack';
import styles from './DaoAssetsTableCard.module.scss';

type DaoAssetsTableCardProps = {
	data: DaoAssetTableDataItem;
};

export const DaoAssetsTableCard: FC<DaoAssetsTableCardProps> = ({ data }) => {
	const { image, name, subtext, amountInUSD } = data;

	return (
		<GridCard
			className={styles.Card}
			aspectRatio={1}
			imageAlt={name}
			imageSrc={image}
		>
			<div className={styles.Content}>
				<span className={styles.Name}>{name}</span>
				<span className={styles.Subtext}>{subtext}</span>
			</div>
			<TextStack
				className={styles.Value}
				label="Value (USD)"
				primaryText={amountInUSD}
				secondaryText={null}
			/>
		</GridCard>
	);
};
