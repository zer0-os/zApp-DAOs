import React from 'react';

import { DOLLAR_SYMBOL } from '../../../lib/constants/currency';
import { formatFiat } from '../../../lib/util/format';

import { Card, SkeletonText } from '@zero-tech/zui/components';

import DaoIcon from '../../../assets/default_dao.svg';

import styles from '../ViewDAO.module.scss';

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
	assetsInUsd
}: DAOInfoProps) => {
	return (
		<div className={styles.Stats}>
			<div className={styles.Dao}>
				<img alt={title + ' icon'} src={DaoIcon} />
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
					text: DOLLAR_SYMBOL + formatFiat(assetsInUsd)
				}}
			/>
		</div>
	);
};
