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
	useLocation,
	useHistory
} from 'react-router-dom';

// Hooks imports
import {
	useCurrentDao,
	useDaoAssets,
	useUserPaymentTokenBalance
} from '../../lib/hooks';

// Library imports
import { Card, Skeleton, TabsNav, Button } from '@zero-tech/zui/components';
import { formatFiat } from '../../lib/util/format';

// Components imports
import { BackLinkButton } from '../../features/ui';
import { DaoAssetsTable } from '../../features/view-dao-assets';
import { DaoTransactions } from '../../features/view-dao-transactions';
import { DaoProposalsTable } from '../../features/view-dao-proposals';
import { ProposalDetail } from '../../features/view-proposal';
import { CreateProposal } from '../../features/create-proposal';

// Constants imports
import { ROOT_PATH, ROUTES } from '../../lib/constants/routes';
import { DOLLAR_SYMBOL } from '../../lib/constants/currency';
import { DaoTab, DAO_CREATE_PROPOSAL } from './DAO.constants';

// Assets imports
import DaoIcon from '../../assets/default_dao.svg';

// Styles imports
import styles from './DAO.module.scss';

export const DAO: FC = () => {
	const { dao, isLoading: isLoadingDao, zna } = useCurrentDao();
	const { data: daoAssetsData, isLoading: isLoadingDaoAssets } =
		useDaoAssets(dao);
	const { data: userPaymentTokenBalance } = useUserPaymentTokenBalance(
		dao?.votingToken.token
	);

	const history = useHistory();
	const { pathname } = useLocation();
	const { url: matchUrl } = useRouteMatch();

	const daoBaseUrl = matchUrl + '/' + zna;

	const showCreateProposalButton =
		pathname === daoBaseUrl + ROUTES.ZDAO_PROPOSALS &&
		userPaymentTokenBalance?.gt(0);

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

	const handleNewProposalButtonClick = () => {
		history.push(
			`${daoBaseUrl + ROUTES.ZDAO_PROPOSALS}/${DAO_CREATE_PROPOSAL}`
		);
	};

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

				<div className={styles.TabsNav}>
					{/* Dao Tabs */}
					<TabsNav tabs={tabs} location={pathname} />

					{/* New Proposal Button */}
					{showCreateProposalButton && (
						<Button onPress={handleNewProposalButtonClick}>New Proposal</Button>
					)}
				</div>
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
						path={
							daoBaseUrl + ROUTES.ZDAO_PROPOSALS + '/' + DAO_CREATE_PROPOSAL
						}
						render={() => (
							<CreateProposal isLoadingDao={isLoadingDao} dao={dao} />
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
