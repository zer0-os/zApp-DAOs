import React, { FC, useLayoutEffect } from 'react';

import type { CreateProposalProps } from './CreateProposal.types';
import { useCreateProposalContainerData } from './useCreateProposalContainerData';

import { BackLinkButton, ConnectWallet } from '../ui';
import { CreateProposalForm } from './CreateProposalForm';
import { Button, LoadingIndicator } from '@zero-tech/zui/components';

import styles from './CreateProposal.module.scss';

export const CreateProposal: FC<CreateProposalProps> = ({
	isLoadingDao,
	dao
}) => {
	const {
		assets,
		onBack,
		isLoading,
		toAllProposals,
		isWalletConnected,
		isDaoHoldingERC20Asset,
		isUserHoldingVotingToken
	} = useCreateProposalContainerData(isLoadingDao, dao);

	useLayoutEffect(() => {
		const nav = document.getElementById('dao-page-nav-tabs');

		nav.style.display = 'none';

		return () => {
			nav.style.display = 'block';
		};
	}, []);

	if (!isWalletConnected) {
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
						<LabelText
							daoTitle={dao?.title}
							daoVotingTokenSymbol={dao?.votingToken.symbol}
							isUserHoldingVotingToken={isUserHoldingVotingToken}
							isDaoHoldingERC20Asset={isDaoHoldingERC20Asset}
						/>

						{(!isUserHoldingVotingToken || !isDaoHoldingERC20Asset) && (
							<Button onPress={onBack}>Back To Dao</Button>
						)}
					</>
				)}
				{isUserHoldingVotingToken && isDaoHoldingERC20Asset && (
					<CreateProposalForm dao={dao} assets={assets} />
				)}
			</div>
		</div>
	);
};

/************
 * LabelText
 ************/
interface LabelTextProps {
	daoTitle: string;
	daoVotingTokenSymbol: string;
	isUserHoldingVotingToken: boolean;
	isDaoHoldingERC20Asset: boolean;
}

const LabelText = ({
	daoTitle,
	daoVotingTokenSymbol,
	isUserHoldingVotingToken,
	isDaoHoldingERC20Asset
}: LabelTextProps) => {
	return (
		<div className={styles.LabelText}>
			{!isUserHoldingVotingToken && (
				<span data-variant={'warning'}>
					To create a proposal, you need to be holding the {daoTitle} voting
					token {daoVotingTokenSymbol} ({daoVotingTokenSymbol}).
				</span>
			)}

			{!isDaoHoldingERC20Asset && (
				<>
					<span data-variant={'warning'}>
						You cannot create a funding proposal as this DAO treasury does not
						hold any tokens to request.
					</span>
					<span>
						Proposals are currently limited to funding proposals (where DAO
						ERC20 tokens are sent to a recipient, if the proposal is approved).
						Please check the assets tab of the DAO.
					</span>
				</>
			)}
		</div>
	);
};
