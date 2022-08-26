import type { FC } from 'react';
import type { DAOTableDataItem } from './DaosTable.types';

import React from 'react';
import { Skeleton } from '@zero-tech/zui/components';
import { isNaN, isNil } from 'lodash';
import { useDaoAssets } from '../../lib/hooks';
import { formatFiat } from '../../lib/util/format';
import { DEFAULT_NETWORK_PROTOCAL } from '../../lib/constants/networks';
import DaoIcon from '../../assets/default_dao.svg';
import styles from './DaosTableRow.module.scss';

type DaosTableRowProps = {
	daoData: DAOTableDataItem;
};

export const DaosTableRow: FC<DaosTableRowProps> = ({ daoData }) => {
	const { isLoading, totalUsd } = useDaoAssets(daoData.dao);

	const getAsyncAmountColumn = () => {
		if (isLoading) {
			return <Skeleton width={100} />;
		}
		if (isNaN(totalUsd) || isNil(totalUsd)) {
			return <>ERR</>;
		}

		return '$' + formatFiat(totalUsd);
	};

	return (
		<tr>
			<td>
				<div className={styles.Dao}>
					<img alt={daoData.dao.title + ' icon'} src={DaoIcon} />
					<div className={styles.Content}>
						<span className={styles.Title}>{daoData.dao.title}</span>
						<span className={styles.Domain}>
							{DEFAULT_NETWORK_PROTOCAL + daoData.zna}
						</span>
					</div>
				</div>
			</td>
			<td className={styles.Right}>{getAsyncAmountColumn()}</td>
		</tr>
	);
};
