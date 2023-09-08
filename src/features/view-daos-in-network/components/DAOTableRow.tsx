import React, { FC } from 'react';

import { useDAOTableRowData } from '../lib';

import { TableData } from '@zero-tech/zui/components/AsyncTable/Column';
import { SkeletonText } from '@zero-tech/zui/components/SkeletonText';
import { Image } from '@zero-tech/zui/components';

import styles from './DAOTableRow.module.scss';

//////////////////
// DaosTableRow //
//////////////////

type DAOTableRowProps = {
	zna: string;
};

export const DAOTableRow: FC<DAOTableRowProps> = ({ zna: znaProp }) => {
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
		<tr className={styles.Row} onClick={onClick}>
			<TableData alignment="left" className={styles.Dao}>
				<Image alt={imgAlt} src={imgSrc} className={styles.Image} />
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
			</TableData>
			<TableData alignment="right">
				<SkeletonText
					asyncText={{
						text: totalUsd,
						isLoading: isLoadingAssetData,
						errorText: 'Failed to load',
					}}
					skeletonOptions={{ width: '150px' }}
				/>
			</TableData>
		</tr>
	);
};
