import type { FC } from 'react';

import React from 'react';
import { Card, Skeleton, TabNav } from '@zero-tech/zui/components';
import { ROOT_PATH, ROUTES } from '../../lib/constants/routes';
import { useCurrentDao, useDaoAssets } from '../../lib/hooks';
import { USD } from '../../lib/constants/currency';
import { formatFiat } from '../../lib/util/format';
import { BackLinkButton } from '../../features/ui';
import { DaoAssetsTable } from '../../features/dao-assets-table';
import { DaoTransactionsTable } from '../../features/dao-transactions-table';
import { DaoProposalsTable } from '../../features/dao-proposals-table';
import DaoIcon from '../../assets/default_dao.svg';
import { DaoPageTab } from './DAOPage.constants';
import styles from './DAOPage.module.scss';

export const DAOPage: FC = () => {
	const { dao, isLoading: isLoadingDao, zna } = useCurrentDao();
	const { totalUsd, isLoading: isLoadingDaoAssets } = useDaoAssets(dao);

	const toTabRoute = (route: ROUTES) =>
		ROOT_PATH + ROUTES.ZDAOS + '/' + zna + route;

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

			<div className={styles.Content}>
				<TabNav
					defaultValue={DaoPageTab.Assets}
					tabs={[
						{
							text: DaoPageTab.Assets,
							to: toTabRoute(ROUTES.ZDAO_ASSETS),
							content: <DaoAssetsTable dao={dao} />
						},
						{
							text: DaoPageTab.Transactions,
							to: toTabRoute(ROUTES.ZDAO_TRANSACTIONS),
							content: <DaoTransactionsTable dao={dao} />
						},
						{
							text: DaoPageTab.Proposals,
							to: toTabRoute(ROUTES.ZDAO_PROPOSALS),
							content: <DaoProposalsTable dao={dao} />
						}
					]}
				/>
			</div>
		</div>
	);
};
