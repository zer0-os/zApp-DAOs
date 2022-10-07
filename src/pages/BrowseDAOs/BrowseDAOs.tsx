import type { FC } from 'react';

import React from 'react';
import { Card } from '@zero-tech/zui/components';
import { useAllZnas, useDaosTotal } from '../../lib/hooks';
import { DOLLAR_SYMBOL } from '../../lib/constants/currency';
import { formatFiat } from '../../lib/util/format';
import { DaosTable } from '../../features/view-daos';
import styles from './BrowseDAOs.module.scss';

export const BrowseDAOs: FC = () => {
	const { isLoading: isLoadingZnas, data: znas } = useAllZnas();
	const { isLoading: isLoadingDaosTotal, total } = useDaosTotal();

	return (
		<>
			<div className={styles.Stats}>
				<Card
					label="Total Value"
					primaryText={{
						isLoading: isLoadingDaosTotal,
						text: DOLLAR_SYMBOL + formatFiat(total)
					}}
				/>
				<Card
					label="DAOs"
					primaryText={{
						isLoading: isLoadingZnas,
						text: znas?.length.toString()
					}}
				/>
			</div>

			<DaosTable />
		</>
	);
};
