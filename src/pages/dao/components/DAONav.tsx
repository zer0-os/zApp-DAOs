import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { zDAO } from '@zero-tech/zdao-sdk';
import { ROUTES } from 'lib/constants/routes';
import { DAO_CREATE_PROPOSAL } from './Page';

import { DaoAssetsTable } from 'features/view-dao-assets';
import { DaoTransactionsList } from 'features/view-dao-transactions';
import { CreateProposal } from 'features/create-proposal';
import { DaoProposalsTable } from 'features/view-dao-proposals';

/////////////
// DAO Nav //
/////////////

export interface DAONavProps {
	baseUrl: string;
	zna?: string;
	dao?: zDAO;
	isLoadingDao?: boolean;
}

export const DAONav = ({ baseUrl, zna, dao, isLoadingDao }: DAONavProps) => {
	return (
		<Switch>
			<Route
				path={baseUrl + ROUTES.ZDAO_ASSETS}
				render={() => <DaoAssetsTable zna={zna} />}
			/>
			<Route
				path={baseUrl + ROUTES.ZDAO_TRANSACTIONS}
				render={() => <DaoTransactionsList zna={zna} />}
			/>
			<Route
				path={baseUrl + ROUTES.ZDAO_PROPOSALS + '/' + DAO_CREATE_PROPOSAL}
				render={() => <CreateProposal isLoadingDao={isLoadingDao} dao={dao} />}
			/>
			<Route
				path={baseUrl + ROUTES.ZDAO_PROPOSALS}
				render={() => <DaoProposalsTable zna={zna} />}
			/>
			<Route path={baseUrl} exact>
				<Redirect to={baseUrl + ROUTES.ZDAO_ASSETS} />
			</Route>
		</Switch>
	);
};
