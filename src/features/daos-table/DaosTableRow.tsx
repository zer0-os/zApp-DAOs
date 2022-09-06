// Types import
import type { FC } from 'react';
import type { DAOTableDataItem } from './DaosTable.types';

// React import
import React from 'react';
import { useHistory } from 'react-router-dom';

// Libraries import
import { Skeleton } from '@zero-tech/zui/components';
import { isNaN, isNil } from 'lodash';

// Hooks import
import { useDaoAssets } from '../../lib/hooks';

// Utils import
import { formatFiat } from '../../lib/util/format';

// Constants import
import { DOLLAR_SYMBOL } from '../../lib/constants/currency';
import { ZERO_ROOT_SYMBOL } from '../../lib/constants/networks';
import { ROOT_PATH, ROUTES } from '../../lib/constants/routes';

// Assets import
import DaoIcon from '../../assets/default_dao.svg';

// Styles import
import styles from './DaosTableRow.module.scss';

type DaosTableRowProps = {
	daoData: DAOTableDataItem;
};

export const DaosTableRow: FC<DaosTableRowProps> = ({ daoData }) => {
	const history = useHistory();
	const { isLoading, data: daoAssetsData } = useDaoAssets(daoData.dao);

	const getAsyncAmountColumn = () => {
		if (isLoading) {
			return <Skeleton width={100} />;
		}
		if (isNaN(daoAssetsData?.totalUsd) || isNil(daoAssetsData?.totalUsd)) {
			return <>ERR</>;
		}

		return DOLLAR_SYMBOL + formatFiat(daoAssetsData?.totalUsd);
	};

	/**
	 * Navigates to the selected DAO zNA
	 */
	const onClickRow = () => {
		history.push(ROOT_PATH + ROUTES.ZDAOS + '/' + daoData.zna);
	};

	return (
		<tr className={styles.Row} onClick={onClickRow}>
			<td>
				<div className={styles.Dao}>
					<img alt={daoData.dao.title + ' icon'} src={DaoIcon} />
					<div className={styles.Content}>
						<span className={styles.Title}>{daoData.dao.title}</span>
						<span className={styles.Domain}>
							{ZERO_ROOT_SYMBOL + daoData.zna}
						</span>
					</div>
				</div>
			</td>
			<td className={styles.Right}>{getAsyncAmountColumn()}</td>
		</tr>
	);
};
