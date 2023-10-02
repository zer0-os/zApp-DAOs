import React, { useMemo } from 'react';
import type { FC } from 'react';

import type { DaoAssetTableDataItem } from './DaoAssetsTable';
import { convertAssetImage, formatTotalAmountOfTokens } from './lib/helpers';

import { Image, TableData } from '@zero-tech/zui/components';
import { IpfsMedia } from '@zero-tech/zapp-utils/components';

import ZeroIcon from 'assets/zero.svg';

import styles from './DaoAssetsTableRow.module.scss';

//////////////////////////
// DAO Assets Table Row //
//////////////////////////

type DaoAssetsTableRowProps = {
	data: DaoAssetTableDataItem;
};

export const DaoAssetsTableRow: FC<DaoAssetsTableRowProps> = ({ data }) => {
	const { image, name, subtext, amountInUSD, amount, decimals } = data;

	const ImageComponent = useMemo(() => {
		if (name === 'ZERO') {
			return <img alt={name} src={ZeroIcon} className={styles.Image} />;
		}

		const { isIpfsUrl, src } = convertAssetImage(image);

		if (isIpfsUrl) {
			return (
				<IpfsMedia
					alt={name}
					src={src}
					className={styles.Image}
					options={{ size: 'thumbnail' }}
				/>
			);
		}

		return <Image alt={name} className={styles.Image} src={src} />;
	}, [image]);

	return (
		<tr className={styles.Row}>
			<TableData alignment="left" className={styles.Dao}>
				{ImageComponent}

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
