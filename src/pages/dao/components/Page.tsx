import React, { FC } from 'react';

import { BackLinkButton } from 'features/ui';
import { DAOInfo, DAOTabs, DAONav } from './';

import { useRoute } from 'lib/hooks/state/useRoute';
import { ROOT_PATH, ROUTES } from 'lib/constants/routes';
import {
	useCurrentDao,
	useDaoAssetsCoins,
	useUserPaymentTokenBalance,
} from 'lib/hooks';
import { useDaoStore } from 'lib/stores/dao';

import styles from './Page.module.scss';

export const DAO_CREATE_PROPOSAL = 'create';

//////////////
// DAO Page //
//////////////

export const DAOPage: FC = () => {
	const { dao, zna, isLoadingDao, isLoadingAssets, assets } = useDaoPageData();
	const daoParams = useDaoStore((state) => state.daoParams);

	const { url } = useRoute();

	return (
		<div className={styles.Container}>
			<div className={styles.Header} id="dao-page-nav-tabs">
				{!daoParams && (
					<BackLinkButton label="All DAOs" to={ROOT_PATH + ROUTES.ZDAOS} />
				)}

				<DAOInfo
					isLoadingDao={isLoadingDao}
					isLoadingAssets={isLoadingAssets || isLoadingDao}
					assetsInUsd={assets?.amountInUSD}
					title={dao?.title}
				/>

				<DAOTabs baseUrl={url} />
			</div>

			<div className={styles.Content}>
				<DAONav baseUrl={url} zna={zna} />
			</div>
		</div>
	);
};

////////////////////
// useDaoPageData //
////////////////////

const useDaoPageData = () => {
	const { dao, isLoading: isLoadingDao, zna } = useCurrentDao();
	const { data: assets, isLoading: isLoadingAssets } = useDaoAssetsCoins(zna);
	const { data: userPaymentTokenBalance } = useUserPaymentTokenBalance(
		dao?.votingToken.token,
	);

	return {
		dao,
		zna,
		isLoadingDao,
		isLoadingAssets: isLoadingAssets || isLoadingDao,
		assets,
		isUserHoldingVotingToken: userPaymentTokenBalance?.gt(0),
	};
};
