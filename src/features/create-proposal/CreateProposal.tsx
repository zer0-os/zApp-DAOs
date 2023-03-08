import type { FC } from 'react';
import React, { useCallback, useLayoutEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { AssetType } from '@zero-tech/zdao-sdk';
import { DAO_CREATE_PROPOSAL } from '../../pages/DAO/DAO.constants';
import type { CreateProposalProps } from './CreateProposal.types';
import {
	useUserPaymentTokenBalance,
	useDaoAssets,
	useWeb3
} from '../../lib/hooks';

import { BackLinkButton, ConnectWallet } from '../ui';
import { CreateProposalForm } from './CreateProposalForm';
import { Button, LoadingIndicator } from '@zero-tech/zui/components';

import styles from './CreateProposal.module.scss';

export const CreateProposal: FC<CreateProposalProps> = ({
	isLoadingDao,
	dao
}) => {
	const { account } = useWeb3();
	const history = useHistory();
	const { data: assets, isLoading: isLoadingAssets } = useDaoAssets(dao);
	const {
		isLoading: isLoadingPaymentTokenBalance,
		data: userPaymentTokenBalance
	} = useUserPaymentTokenBalance(dao?.votingToken.token);

	const isLoading =
		isLoadingDao || isLoadingPaymentTokenBalance || isLoadingAssets;
	const isHoldingVotingToken = userPaymentTokenBalance?.gt(0);
	const toAllProposals = history.location.pathname.replace(
		`/${DAO_CREATE_PROPOSAL}`,
		''
	);
	const isDaoHoldingERC20Asset =
		Boolean(assets) &&
		assets.filter((asset) => asset.type === AssetType.ERC20).length > 0;

	useLayoutEffect(() => {
		const nav = document.getElementById('dao-page-nav-tabs');

		nav.style.display = 'none';

		return () => {
			nav.style.display = 'block';
		};
	}, []);

	const handleGoToDao = useCallback(() => {
		history.replace(toAllProposals);
	}, [history, toAllProposals]);

	if (!account) {
		return (
			<ConnectWallet message={'Connect your wallet to create a proposal.'} />
		);
	}

	return (
		<div className={styles.Container}>
			<BackLinkButton label="All Proposals" to={toAllProposals} />

			<h1 className={styles.Header}>Create a Proposal</h1>

			<div className={styles.Content}>
				{isLoading && (
					<LoadingIndicator
						className={styles.Loading}
						text="Loading DAO"
						spinnerPosition="left"
					/>
				)}

				{!isLoading && (
					<>
						<>
							{!isHoldingVotingToken && (
								<div className={styles.TextContent} data-variant={'warning'}>
									To create a proposal, you need to be holding the {dao.title}{' '}
									voting token
									{dao.votingToken.symbol && ` (${dao.votingToken.symbol})`}.
								</div>
							)}

							{!isDaoHoldingERC20Asset && (
								<>
									<div className={styles.TextContent} data-variant={'warning'}>
										You cannot create a funding proposal as this DAO treasury
										does not hold any tokens to request.
									</div>
									<div className={styles.TextContent}>
										Proposals are currently limited to funding proposals (where
										DAO ERC20 tokens are sent to a recipient, if the proposal is
										approved). Please check the assets tab of the DAO.
									</div>
								</>
							)}
							{(!isHoldingVotingToken || !isDaoHoldingERC20Asset) && (
								<Button onPress={handleGoToDao}>Back To Dao</Button>
							)}
						</>
					</>
				)}
				{isHoldingVotingToken && isDaoHoldingERC20Asset && (
					<CreateProposalForm dao={dao} assets={assets} />
				)}
			</div>
		</div>
	);
};
