import type { FC } from 'react';

import React, { useEffect } from 'react';
import { useWeb3, useCurrentDao, useRedirect } from '../lib/hooks';
import { ROOT_PATH, ROUTES } from '../lib/constants/routes';
import { ConnectWallet } from '../features/ui';
import { DAOList } from './DAOList';
import { DAOPage } from './DAOPage';

export const DAOs: FC = () => {
	const { account } = useWeb3();
	const { zna, isLoading, dao } = useCurrentDao();
	const { redirect } = useRedirect();

	/**
	 * Handle loading a DAO which does not exist
	 */
	useEffect(() => {
		if (isLoading || dao || !zna.length) {
			return;
		}

		if (!dao) {
			redirect(ROOT_PATH + ROUTES.ZDAOS, 'Could not find a DAO for ' + zna);
		}
	}, [isLoading, dao, zna, redirect]);

	if (!account) {
		return (
			<ConnectWallet message={'Connect a Web3 wallet to see your Dao data.'} />
		);
	}

	console.log({ zna, isLoading, dao });

	return zna === '' ? <DAOList /> : <DAOPage />;
};
