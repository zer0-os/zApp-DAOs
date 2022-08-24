import type { FC } from 'react';
import type { zDAO } from '@zero-tech/zdao-sdk';
import type { DAOTableDataItem } from './DaosTable.types';

import { useDaoAssets } from '../../lib/hooks';
import { formatFiat } from '../../lib/util/format';
import DaoIcon from '../../assets/default_dao.svg';
import styles from './DaosTableRow.module.scss';

type DaosTableRowProps = {
	daoData: DAOTableDataItem;
};

export const DaosTableRow: FC<DaosTableRowProps> = ({ daoData }) => {
	const { isLoading, totalUsd } = useDaoAssets(daoData.dao);

	return (
		<tr>
			<td>
				<div className={styles.Container}>
					<img alt={daoData.dao.title + ' icon'} src={DaoIcon} />{' '}
					{daoData.dao.title}
				</div>
			</td>
			<td className={styles.Right}>{'$' + formatFiat(totalUsd)}</td>
		</tr>
	);
};
