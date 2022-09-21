// Types imports
import type { FC } from 'react';
import type { TabNav } from '@zero-tech/zui/components';

// React imports
import React, { useMemo } from 'react';
import {
	Switch,
	Route,
	Redirect,
	useRouteMatch,
	useLocation
} from 'react-router-dom';

// Hooks imports
import { useCurrentDao, useDaoAssets } from '../../lib/hooks';

// Library imports
import { Card, Skeleton, TabsNav } from '@zero-tech/zui/components';
import { formatFiat } from '../../lib/util/format';

// Components imports
import { BackLinkButton } from '../../features/ui';
import { DaoAssetsTable } from '../../features/dao-assets-table';
import { DaoTransactions } from '../../features/dao-transactions';
import {
	DaoProposalsTable,
	ProposalDetail
} from '../../features/dao-proposals-table';

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

	const { pathname } = useLocation();
	const { url: matchUrl } = useRouteMatch();

	const daoBaseUrl = matchUrl + '/' + zna;

	const tabs: TabNav[] = useMemo(
		() => [
			{
				text: DaoTab.Assets,
				to: daoBaseUrl + ROUTES.ZDAO_ASSETS
			},
			{
				text: DaoTab.Transactions,
				to: daoBaseUrl + ROUTES.ZDAO_TRANSACTIONS
			},
			{
				text: DaoTab.Proposals,
				to: daoBaseUrl + ROUTES.ZDAO_PROPOSALS
			}
		],
		[daoBaseUrl]
	);

	return (
		<div className={styles.Container}>
			<div className={styles.Header} id="dao-page-nav-tabs">
				{/* Back to All Daos */}
				<BackLinkButton label="All DAOs" to={ROOT_PATH + ROUTES.ZDAOS} />

				{/* Dao logo, title and total amount */}
				<div className={styles.Stats}>
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

				{/* Dao Tabs */}
				<TabsNav tabs={tabs} location={pathname} />
			</div>

			<div className={styles.Content}>
				<Switch>
					<Route
						path={daoBaseUrl + ROUTES.ZDAO_ASSETS}
						render={() => (
							<DaoAssetsTable isLoadingDao={isLoadingDao} dao={dao} />
						)}
					/>
					<Route
						path={daoBaseUrl + ROUTES.ZDAO_TRANSACTIONS}
						render={() => (
							<DaoTransactions isLoadingDao={isLoadingDao} dao={dao} />
						)}
					/>
					<Route
						path={daoBaseUrl + ROUTES.ZDAO_PROPOSALS + '/:proposalId'}
						render={() => (
							<ProposalDetail isLoadingDao={isLoadingDao} dao={dao} />
						)}
					/>
					<Route
						path={daoBaseUrl + ROUTES.ZDAO_PROPOSALS}
						render={() => (
							<DaoProposalsTable isLoadingDao={isLoadingDao} dao={dao} />
						)}
					/>
					<Route path={daoBaseUrl} exact>
						<Redirect to={daoBaseUrl + ROUTES.ZDAO_ASSETS} />
					</Route>
				</Switch>
			</div>
		</div>
	);
};
