import type { FC } from 'react';

import React from 'react';
import { Card } from '@zero-tech/zui/components';
import { useAllZnas, useAllDaosTotalPrice } from '../../lib/hooks';
import { USD } from '../../lib/constants/currency';
import { formatFiat } from '../../lib/util/format';
import { DaosTable } from '../../features/daos-table';
import styles from './DAOList.module.scss';

export const DAOList: FC = () => {
	const { isLoading: isLoadingZnas, znas } = useAllZnas();
	const { isLoading: isLoadingTotalPrice, totalUsd } =
		useAllDaosTotalPrice(znas);

	return (
		<>
			<div className={styles.Stats}>
				<Card
					title="Total Value"
					value={{
						isLoading: isLoadingZnas || isLoadingTotalPrice,
						text: USD + formatFiat(totalUsd)
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
