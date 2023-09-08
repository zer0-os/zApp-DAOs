import React, { useEffect } from 'react';

import { useAllZnas, useCurrentDao, useRedirect } from '../../../lib/hooks';
import { DOLLAR_SYMBOL } from '../../../lib/constants/currency';
import { formatFiat } from '../../../lib/util/format';
import { useDaosTotal } from '../lib';
import {
	DEFAULT_ZNS_DOMAIN,
	ROOT_PATH,
	ROUTES,
} from '../../../lib/constants/routes';

import { DAOTable } from '../../../features/view-daos-in-network';
import { Card } from '@zero-tech/zui/components';

import styles from './Page.module.scss';

///////////////
// DAOs Page //
///////////////

export const DAOsPage = () => {
	const { isLoading: isLoadingZnas, data: znas } = useAllZnas();
	const { isLoading: isLoadingDaosTotal, total } = useDaosTotal();

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
			if (zna !== DEFAULT_ZNS_DOMAIN) {
				redirect(ROOT_PATH + ROUTES.ZDAOS, 'Could not find a DAO for ' + zna);
				// ^ This causes a redirect loop, so checking that the root path isn't the current path before redirect.
			}
		}
	}, [isLoading, dao, zna, redirect]);

	return (
		<>
			<div className={styles.Stats}>
				<Card
					label="Total Value"
					primaryText={{
						isLoading: isLoadingDaosTotal,
						text: DOLLAR_SYMBOL + formatFiat(total),
					}}
				/>
				<Card
					label="DAOs"
					primaryText={{
						isLoading: isLoadingZnas,
						text: znas?.length.toString(),
					}}
				/>
			</div>

			<DAOTable />
		</>
	);
};
