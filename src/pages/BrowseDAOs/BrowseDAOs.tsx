import type { FC } from 'react';

import React from 'react';
import { Card } from '@zero-tech/zui/components';
import { useAllZnas, useDaosTotal } from '../../lib/hooks';
import { DOLLAR_SYMBOL } from '../../lib/constants/currency';
import { formatFiat } from '../../lib/util/format';
import { DaosTable } from '../../features/daos-table';
import styles from './BrowseDAOs.module.scss';

export const BrowseDAOs: FC = () => {
	const { isLoading: isLoadingZnas, data: znas } = useAllZnas();
	const { isLoading: isLoadingDaosTotal, total } = useDaosTotal();

	return (
		<>
			<div className={styles.Stats}>
				<Card
					title="Total Value"
					value={{
						isLoading: isLoadingDaosTotal,
						text: DOLLAR_SYMBOL + formatFiat(total)
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
