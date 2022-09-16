// Types imports
import type { FC } from 'react';

// React imports
import React from 'react';

// Hooks imports
import { useCurrentDao, useDaoAssets } from '../../lib/hooks';

// Library imports
import { Card, Skeleton, Tabs } from '@zero-tech/zui/components';
import { formatFiat } from '../../lib/util/format';

// Components imports
import { BackLinkButton } from '../../features/ui';
import { DaoAssetsTable } from '../../features/dao-assets-table';
import { DaoTransactions } from '../../features/dao-transactions';
import { DaoProposalsTable } from '../../features/dao-proposals-table';

// Constants imports
import { ROOT_PATH, ROUTES } from '../../lib/constants/routes';
import { DOLLAR_SYMBOL } from '../../lib/constants/currency';
import { DaoTab } from './DAO.constants';

// Assets imports
import DaoIcon from '../../assets/default_dao.svg';

// Styles imports
import styles from './DAO.module.scss';

export const DAO: FC = () => {
	const { dao, isLoading: isLoadingDao, zna } = useCurrentDao();
	const { data: daoAssetsData, isLoading: isLoadingDaoAssets } =
		useDaoAssets(dao);

	// TODO:: Update TabNav from zUI to support react-router-dom
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
						text: DOLLAR_SYMBOL + formatFiat(daoAssetsData?.totalUsd)
					}}
				/>
			</div>

			<div className={styles.Content}>
				<Tabs
					defaultValue={DaoTab.Assets}
					tabs={[
						{
							text: DaoTab.Assets,
							// to: toTabRoute(ROUTES.ZDAO_ASSETS),
							content: <DaoAssetsTable isLoadingDao={isLoadingDao} dao={dao} />
						},
						{
							text: DaoTab.Transactions,
							// to: toTabRoute(ROUTES.ZDAO_TRANSACTIONS),
							content: (
								<DaoTransactions isLoadingDao={isLoadingDao} dao={dao} />
							)
						},
						{
							text: DaoTab.Proposals,
							// to: toTabRoute(ROUTES.ZDAO_PROPOSALS),
							content: <DaoProposalsTable dao={dao} />
						}
					]}
				/>
			</div>
		</div>
	);
};
