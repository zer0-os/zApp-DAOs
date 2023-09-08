import React, { FC } from 'react';

import { useDAOTableRowData } from '../lib';

import { GridCard } from '@zero-tech/zui/components/GridCard';
import { TextStack } from '@zero-tech/zui/components/TextStack';

import styles from './DAOTableCard.module.scss';
import { SkeletonText } from '@zero-tech/zui/components/SkeletonText';

///////////////////
// DaosTableCard //
///////////////////

type DAOTableCardProps = {
	zna: string;
};

export const DAOTableCard: FC<DAOTableCardProps> = ({ zna: znaProp }) => {
	const {
		imgAlt,
		imgSrc,
		isLoadingAssetData,
		isLoadingDAOData,
		onClick,
		title,
		totalUsd,
		zna,
	} = useDAOTableRowData(znaProp);

	return (
		<GridCard
			className={styles.Card}
			aspectRatio={1}
			imageAlt={imgAlt}
			imageSrc={imgSrc}
			onClick={onClick}
		>
			<div className={styles.Content}>
				<SkeletonText
					asyncText={{
						text: title,
						isLoading: isLoadingDAOData,
					}}
					className={styles.Title}
				/>
				<span className={styles.Domain}>{zna}</span>
			</div>
			<TextStack
				className={styles.Value}
				label="Total Value"
				primaryText={{
					text: totalUsd,
					isLoading: isLoadingAssetData || isLoadingDAOData,
					errorText: 'Failed to load',
				}}
				secondaryText={null}
			/>
		</GridCard>
	);
};
