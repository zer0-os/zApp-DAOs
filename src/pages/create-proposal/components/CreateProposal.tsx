import React from 'react';

import { useCurrentDao, useDaoAssetsCoins } from 'lib/hooks';

import { AllProposalsLink } from '../../proposal/components/AllProposalsLink';
import { AssetType } from '@zero-tech/zdao-sdk';
import { CreateProposalForm } from 'features/create-proposal';

import styles from './CreateProposal.module.scss';

export const CreateProposal = () => {
	return (
		<div className={styles.Create}>
			<AllProposalsLink />
			<h1>Create a Proposal</h1>
			<Body />
		</div>
	);
};

const Body = () => {
	const { dao, zna, isLoading: isLoadingDao } = useCurrentDao();
	const { data: daoCoins, isLoading: isLoadingAssets } = useDaoAssetsCoins(zna);

	const isLoading = isLoadingDao || isLoadingAssets;

	const isHoldingErc20 = daoCoins?.coins.some(
		(coin) => coin.type === AssetType.ERC20,
	);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!dao) {
		return <div>No DAO</div>;
	}

	if (!isHoldingErc20) {
		return <div>not holding erc 20</div>;
	}

	return <CreateProposalForm />;
};
