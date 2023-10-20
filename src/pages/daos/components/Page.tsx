import { useEffect } from 'react';

import { useAllZnas, useCurrentDao, useRedirect } from 'lib/hooks';
import { DOLLAR_SYMBOL } from 'lib/constants/currency';
import { formatFiat } from 'lib/util/format';
import { DEFAULT_ZNS_DOMAIN, ROOT_PATH, ROUTES } from 'lib/constants/routes';
import { useTotalsStore } from 'lib/stores/totals';

import { DAOTable } from 'features/view-daos-in-network';
import { Card } from '@zero-tech/zui/components';

import styles from './Page.module.scss';

///////////////
// DAOs Page //
///////////////

export const DAOsPage = () => {
	const { redirect } = useRedirect();
	const { isLoading: isLoadingZnas, data: znas } = useAllZnas();
	const { zna, isLoading, dao } = useCurrentDao();

	/**
	 * Handle loading a DAO which does not exist
	 */
	useEffect(() => {
		if (isLoading || dao || !zna.length) {
			return;
		}

		if (!dao) {
			if (zna !== DEFAULT_ZNS_DOMAIN) {
				// eslint-disable-next-line
				// @ts-ignore
				redirect(ROOT_PATH + ROUTES.ZDAOS, 'Could not find a DAO for ' + zna);
				// ^ This causes a redirect loop, so checking that the root path isn't the current path before redirect.
			}
		}
	}, [isLoading, dao, zna, redirect]);

	return (
		<>
			<div className={styles.Stats}>
				<TotalValueCard />
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

const TotalValueCard = () => {
	const { data: znas } = useAllZnas();

	const assetTotalUsd = useTotalsStore(
		(state) => state?.daos.reduce((acc, dao) => acc + dao.totalUsd, 0) ?? 0,
	);
	const numDaos = useTotalsStore((state) => state?.daos.length ?? 0);

	return (
		<Card
			label="Total Value"
			primaryText={{
				isLoading: numDaos !== znas?.length,
				text: DOLLAR_SYMBOL + formatFiat(assetTotalUsd),
			}}
		/>
	);
};
