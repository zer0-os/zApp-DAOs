import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { ROOT_PATH, ROUTES } from './lib/constants/routes';
import { useRoute } from './lib/hooks/state/useRoute';

import {
	DynamicSizeWrapper,
	ZAppContent,
} from '@zero-tech/zapp-utils/components';

import { DAOsPage, DAOPage, Proposal, CreateProposal } from './pages';

import styles from './App.module.scss';
import { useDaoStore } from './lib/stores/dao';

export const App = () => {
	const { url } = useRoute();
	const daoParams = useDaoStore((state) => state.daoParams);

	return (
		<DynamicSizeWrapper>
			<ZAppContent>
				<main className={styles.Main}>
					<Switch>
						{!daoParams && (
							<Route
								path={ROOT_PATH + ROUTES.ZDAOS}
								exact
								component={DAOsPage}
							/>
						)}
						<Route path={url + ROUTES.ZDAO_PROPOSALS + '/create'} exact>
							<CreateProposal />
						</Route>
						<Route path={url + ROUTES.ZDAO_PROPOSALS + '/:proposalId'} exact>
							<Proposal />
						</Route>
						<Route>
							<DAOPage />
						</Route>
					</Switch>
				</main>
			</ZAppContent>
		</DynamicSizeWrapper>
	);
};
