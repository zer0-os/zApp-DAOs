import type { FC } from 'react';

import React from 'react';
import { Card } from '@zero-tech/zui/components';
import { useAllZnas, useAllDaos, useAllDaosTotalPrice } from '../../lib/hooks';
import { DOLLAR_SYMBOL } from '../../lib/constants/currency';
import { formatFiat } from '../../lib/util/format';
import { DaosTable } from '../../features/daos-table';
import styles from './BrowseDAOs.module.scss';

export const BrowseDAOs: FC = () => {
	const { isLoading: isLoadingZnas, data: znas } = useAllZnas();
	const { isLoading: isLoadingDaos, data: daos } = useAllDaos(znas);
	const { isLoading: isLoadingTotalPrice, data: totalUsd } =
		useAllDaosTotalPrice(isLoadingDaos, daos);

	return (
		<>
			<div className={styles.Stats}>
				<Card
					title="Total Value"
					value={{
						isLoading: isLoadingZnas || isLoadingDaos || isLoadingTotalPrice,
						text: DOLLAR_SYMBOL + formatFiat(totalUsd)
					}}
				/>
				<Card
					title="DAOs"
					value={{ isLoading: isLoadingZnas, text: znas?.length.toString() }}
				/>
			</div>

			<DaosTable />
		</>
	);
};
