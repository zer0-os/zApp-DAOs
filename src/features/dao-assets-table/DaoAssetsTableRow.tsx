import type { FC } from 'react';
import type { DaoAssetTableDataItem } from './DaoAssetsTable.types';

import React from 'react';
import { formatTotalAmountOfTokens } from './DaoAssetsTable.helpers';
import { Image } from '../ui';
import styles from './DaoAssetsTable.module.scss';

type DaoAssetsTableRowProps = {
	data: DaoAssetTableDataItem;
};

export const DaoAssetsTableRow: FC<DaoAssetsTableRowProps> = ({ data }) => {
	const { image, name, subtext, amountInUSD } = data;

	return (
		<tr className={styles.Row}>
			<td>
				<div className={styles.Dao}>
					<Image
						alt={name}
						url={image}
						classNames={{ container: styles.Image }}
					/>

					<div className={styles.Content}>
						<span className={styles.Title}>{name}</span>
						<span className={styles.Symbol}>{subtext}</span>
					</div>
				</div>
			</td>
			<td className={styles.Right}>{formatTotalAmountOfTokens(data)}</td>
			<td className={styles.Right}>{amountInUSD}</td>
		</tr>
	);
};
