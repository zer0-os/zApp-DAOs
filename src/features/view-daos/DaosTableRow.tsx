// Types import
import type { FC } from 'react';
import type { DAOTableDataItem } from './DaosTable.types';

// React import
import React from 'react';

// Hooks import
import { useDaosTableItemData } from './hooks';

// Styles import
import styles from './DaosTableRow.module.scss';

type DaosTableRowProps = {
	daoData: DAOTableDataItem;
};

export const DaosTableRow: FC<DaosTableRowProps> = ({ daoData }) => {
	const { title, zna, imgAlt, imgSrc, usdValue, onClick } =
		useDaosTableItemData(daoData);

	return (
		<tr className={styles.Row} onClick={onClick}>
			<td>
				<div className={styles.Dao}>
					<img alt={imgAlt} src={imgSrc} />
					<div className={styles.Content}>
						<span className={styles.Title}>{title}</span>
						<span className={styles.Domain}>{zna}</span>
					</div>
				</div>
			</td>
			<td className={styles.Right}>{usdValue}</td>
		</tr>
	);
};
