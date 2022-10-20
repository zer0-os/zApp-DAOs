import type { FC } from 'react';
import type { DaoAssetTableDataItem } from './DaoAssetsTable.types';

import React from 'react';
import { IpfsMedia } from '@zero-tech/zapp-utils/components';
import { getHashFromIpfsUrl } from '@zero-tech/zapp-utils/utils/ipfs';

import { TableData } from '@zero-tech/zui/components/AsyncTable/Column';
import { Image } from '@zero-tech/zui/components';
import { formatTotalAmountOfTokens } from './DaoAssetsTable.helpers';
import styles from './DaoAssetsTableRow.module.scss';

type DaoAssetsTableRowProps = {
	data: DaoAssetTableDataItem;
};

export const DaoAssetsTableRow: FC<DaoAssetsTableRowProps> = ({ data }) => {
	const { image, name, subtext, amountInUSD, amount, decimals } = data;

	const isIpfsUrl = Boolean(getHashFromIpfsUrl(image));
	const src = image && image.startsWith('/') ? location.origin + image : image;

	return (
		<tr className={styles.Row}>
			<TableData alignment="left" className={styles.Dao}>
				{isIpfsUrl ? (
					<IpfsMedia
						alt={name}
						src={src}
						className={styles.Image}
						options={{ size: 'thumbnail' }}
					/>
				) : (
					<Image alt={name} className={styles.Image} src={src} />
				)}

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
