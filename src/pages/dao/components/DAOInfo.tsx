import React from 'react';

import { DOLLAR_SYMBOL } from 'lib/constants/currency';
import { formatFiat } from 'lib/util/format';

import { Card, SkeletonText, Image } from '@zero-tech/zui/components';

import DaoIcon from 'assets/default_dao.svg';

import styles from './Page.module.scss';
import { useDaoStore } from '../../../lib/stores/dao';

//////////////
// DAO Info //
//////////////

interface DAOInfoProps {
	zna?: string;
	title?: string;
	isLoadingDao?: boolean;
	isLoadingAssets?: boolean;
	assetsInUsd?: number;
}

export const DAOInfo = ({
	title,
	isLoadingDao,
	isLoadingAssets,
	assetsInUsd,
}: DAOInfoProps) => {
	const daoParams = useDaoStore((state) => state.daoParams);
	const imageUri = daoParams?.logoUri ?? DaoIcon;

	return (
		<div className={styles.Stats}>
			<div className={styles.Dao}>
				{daoParams?.logoUri ? (
					<Image className={styles.Logo} alt={title + ' icon'} src={imageUri} />
				) : (
					<img className={styles.Logo} alt={title + ' icon'} src={imageUri} />
				)}
				<SkeletonText
					as="h1"
					asyncText={{ text: title, isLoading: isLoadingDao }}
					skeletonOptions={{ width: 100 }}
				/>
			</div>
			<Card
				label="Total Value"
				primaryText={{
					isLoading: isLoadingAssets,
					text: DOLLAR_SYMBOL + formatFiat(assetsInUsd),
				}}
			/>
		</div>
	);
};
