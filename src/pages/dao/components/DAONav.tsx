import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { ROUTES } from 'lib/constants/routes';
import { DAO_CREATE_PROPOSAL } from './Page';

import { DaoAssetsTable } from 'features/view-dao-assets';
import { TransactionList } from 'features/view-transactions';
import { CreateProposal } from 'pages/create-proposal';
import { ProposalTable } from 'features/view-proposals';

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
				render={() => <TransactionList zna={zna} />}
			/>
			<Route
				path={baseUrl + ROUTES.ZDAO_PROPOSALS + '/' + DAO_CREATE_PROPOSAL}
				render={() => <CreateProposal />}
			/>
			<Route
				path={baseUrl + ROUTES.ZDAO_PROPOSALS}
				render={() => <ProposalTable zna={zna} />}
			/>
			<Route path={baseUrl} exact>
				<Redirect to={baseUrl + ROUTES.ZDAO_ASSETS} />
			</Route>
		</Switch>
	);
};
