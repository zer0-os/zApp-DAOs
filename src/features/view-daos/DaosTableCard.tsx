// Types import
import type { FC } from 'react';
import type { DAOTableDataItem } from './DaosTable.types';

// React import
import React from 'react';

// Hooks import
import { useDaosTableItemData } from './hooks';

// Components import
import { GridCard } from '@zero-tech/zui/components/GridCard';
import { TextStack } from '@zero-tech/zui/components/TextStack';

// Styles import
import styles from './DaosTableCard.module.scss';

type DaosTableCardProps = {
	daoData: DAOTableDataItem;
};

export const DaosTableCard: FC<DaosTableCardProps> = ({ daoData }) => {
	const { title, zna, imgAlt, imgSrc, totalUsd, isLoading, onClick } =
		useDaosTableItemData(daoData);

	return (
		<GridCard
			className={styles.Card}
			aspectRatio={1}
			imageAlt={imgAlt}
			imageSrc={imgSrc}
			onClick={onClick}
		>
			<div className={styles.Content}>
				<span className={styles.Title}>{title}</span>
				<span className={styles.Domain}>{zna}</span>
			</div>
			<TextStack
				className={styles.Value}
				label="Total Value"
				primaryText={{ text: totalUsd, isLoading }}
				secondaryText={null}
			/>
		</GridCard>
	);
};
