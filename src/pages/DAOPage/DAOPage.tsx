import type { FC } from 'react';

import React from 'react';
import { Card, Skeleton } from '@zero-tech/zui/components';
import { ROOT_PATH, ROUTES } from '../../lib/constants/routes';
import { useCurrentDao, useDaoAssets } from '../../lib/hooks';
import { USD } from '../../lib/constants/currency';
import { formatFiat } from '../../lib/util/format';
import { BackLinkButton } from '../../features/ui';
import DaoIcon from '../../assets/default_dao.svg';
import styles from './DAOPage.module.scss';

export const DAOPage: FC = () => {
	const { dao, isLoading: isLoadingDao } = useCurrentDao();
	const { totalUsd, isLoading: isLoadingDaoAssets } = useDaoAssets(dao);

	return (
		<div className={styles.Container}>
			<BackLinkButton label="All DAOs" to={ROOT_PATH + ROUTES.ZDAOS} />

			<div className={styles.Header}>
				<div className={styles.Dao}>
					<img alt={dao?.title + ' icon'} src={DaoIcon} />
					{isLoadingDao ? <Skeleton width={100} /> : <h1>{dao?.title}</h1>}
				</div>
				<Card
					title="Total Value"
					value={{
						isLoading: isLoadingDao || isLoadingDaoAssets,
						text: USD + formatFiat(totalUsd)
					}}
				/>
			</div>

			{/* TODO:: Should show tab nav and dao details */}
			<p>DAO - Detail Page</p>
		</div>
	);
};
