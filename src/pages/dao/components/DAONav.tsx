import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { ROUTES } from 'lib/constants/routes';
import { DAO_CREATE_PROPOSAL } from './Page';

import { DaoAssetsTable } from 'features/view-dao-assets';
import { DaoTransactionsList } from 'features/view-dao-transactions';
import { CreateProposal } from 'pages/create-proposal';
import { DaoProposalsTable } from 'features/view-dao-proposals';

/////////////
// DAO Nav //
/////////////

export interface DAONavProps {
	baseUrl: string;
	zna?: string;
}

export const DAONav = ({ baseUrl, zna }: DAONavProps) => {
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
				render={() => <CreateProposal />}
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
