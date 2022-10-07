// Types import
import type { FC } from 'react';
import type { DAOTableDataItem } from './DaosTable.types';

// React import
import React from 'react';

// Components import
import { TableData } from '@zero-tech/zui/components/AsyncTable/Column';
import { SkeletonText } from '@zero-tech/zui/components/SkeletonText';

// Hooks import
import { useDaosTableItemData } from './hooks';

// Styles import
import styles from './DaosTableRow.module.scss';

type DaosTableRowProps = {
	daoData: DAOTableDataItem;
};

export const DaosTableRow: FC<DaosTableRowProps> = ({ daoData }) => {
	const { title, zna, imgAlt, imgSrc, totalUsd, isLoading, onClick } =
		useDaosTableItemData(daoData);

	return (
		<tr className={styles.Row} onClick={onClick}>
			<TableData alignment="left" className={styles.Dao}>
				<img alt={imgAlt} src={imgSrc} />
				<div className={styles.Content}>
					<span className={styles.Title}>{title}</span>
					<span className={styles.Domain}>{zna}</span>
				</div>
			</TableData>
			<TableData alignment="right">
				<SkeletonText asyncText={{ text: totalUsd, isLoading }} />
			</TableData>
		</tr>
	);
};
