import type { FC } from 'react';
import type { DaoAssetTableDataItem } from './DaoAssetsTable.types';

import React from 'react';
import { TableData } from '@zero-tech/zui/components/AsyncTable/Column';
import { Image } from '@zero-tech/zui/components';
import { formatTotalAmountOfTokens } from './DaoAssetsTable.helpers';
import styles from './DaoAssetsTableRow.module.scss';

type DaoAssetsTableRowProps = {
	data: DaoAssetTableDataItem;
};

export const DaoAssetsTableRow: FC<DaoAssetsTableRowProps> = ({ data }) => {
	const { image, name, subtext, amountInUSD, amount, decimals } = data;

	const src = image && image.startsWith('/') ? location.origin + image : image;

	return (
		<tr className={styles.Row}>
			<TableData alignment="left" className={styles.Dao}>
				<Image alt={name} src={src} className={styles.Image} />

				<div className={styles.Content}>
					<span className={styles.Title}>{name}</span>
					<span className={styles.Symbol}>{subtext}</span>
				</div>
			</TableData>
			<TableData alignment="right">
				{formatTotalAmountOfTokens(amount, decimals)}
			</TableData>
			<TableData alignment="right" className={styles.USD}>
				{amountInUSD}
			</TableData>
		</tr>
	);
};
