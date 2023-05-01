import React from 'react';
import type { FC } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import {
	DynamicSizeWrapper,
	ZAppContent
} from '@zero-tech/zapp-utils/components';
import { ROOT_PATH, ROUTES } from './lib/constants/routes';

import { BrowseDAOs, ViewDAO, Proposal, CreateProposal } from './pages';

import styles from './App.module.scss';

export const App: FC = () => {
	const { url } = useRouteMatch();

	return (
		<DynamicSizeWrapper>
			<ZAppContent>
				<main className={styles.Main}>
					<Switch>
						<Route path={ROOT_PATH + ROUTES.ZDAOS} exact>
							<BrowseDAOs />
						</Route>
						<Route path={url + ROUTES.ZDAO_PROPOSALS + '/create'} exact>
							<CreateProposal />
						</Route>
						<Route path={url + ROUTES.ZDAO_PROPOSALS + '/:proposalId'} exact>
							<Proposal />
						</Route>
						<Route>
							<ViewDAO />
						</Route>
					</Switch>
				</main>
			</ZAppContent>
		</DynamicSizeWrapper>
	);
};
