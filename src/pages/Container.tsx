import type { FC } from 'react';

import { useEffect } from 'react';
import { useWeb3, useCurrentDao, useRedirect } from '../lib/hooks';
import { ROOT_PATH, ROUTES } from '../lib/constants/routes';
import { ConnectWallet } from '../features/ui';
import { DAOList } from './DAOList';
import { DAOPage } from './DAOPage';

export const Container: FC = () => {
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
			redirect(ROOT_PATH + ROUTES.ZDAO, 'Could not find a DAO for ' + zna);
		}
	}, [dao, zna]);

	if (!account) {
		return (
			<ConnectWallet message={'Connect a Web3 wallet to see your Dao data.'} />
		);
	}

	return zna === '' ? <DAOList /> : <DAOPage />;
};
