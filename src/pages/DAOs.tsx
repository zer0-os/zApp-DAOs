import type { FC } from 'react';

import React, { useEffect } from 'react';
import { useCurrentDao, useRedirect } from '../lib/hooks';
import { DEFAULT_ZNS_DOMAIN, ROOT_PATH, ROUTES } from '../lib/constants/routes';
import { BrowseDAOs, DAO } from './index';

export const DAOs: FC = () => {
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

	return zna === DEFAULT_ZNS_DOMAIN ? <BrowseDAOs /> : <DAO />;
};
