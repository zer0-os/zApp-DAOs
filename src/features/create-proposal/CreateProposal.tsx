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
		isLoading,
		handleGoToDao,
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
						<TextContent
							daoTitle={dao?.title}
							daoVotingToken={dao?.votingToken.symbol}
							isUserHoldingVotingToken={isUserHoldingVotingToken}
						/>
						{(!isUserHoldingVotingToken || !isDaoHoldingERC20Asset) && (
							<Button onPress={handleGoToDao}>Back To Dao</Button>
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

/*************
 * TextContent
 *************/
interface TextContentProps {
	daoTitle: string;
	daoVotingToken: string;
	isUserHoldingVotingToken: boolean;
}

const TextContent = ({
	daoTitle,
	daoVotingToken,
	isUserHoldingVotingToken
}: TextContentProps) => {
	const userTokenWarning: TextProps['text'] = `To create a proposal, you need to be holding the ${daoTitle} voting token ${daoVotingToken} (${daoVotingToken}).`;
	const daoTokenWarning: TextProps['text'] =
		'You cannot create a funding proposal as this DAO treasury does not hold any tokens to request.';
	const fundingProposalWarning: TextProps['text'] =
		'Proposals are currently limited to funding proposals (where DAO ERC20 tokens are sent to a recipient, if the proposal is approved). Please check the assets tab of the DAO.';

	// should include check for dao asset here to show both warnings when user goes directly to path
	return !isUserHoldingVotingToken ? (
		<Text text={userTokenWarning} variant={'warning'} />
	) : (
		<>
			<Text text={daoTokenWarning} variant={'warning'} />
			<Text text={fundingProposalWarning} />
		</>
	);
};

/********
 * Text
 ********/
interface TextProps {
	text: string;
	variant?: 'warning';
}

const Text = ({ text, variant }: TextProps) => {
	return (
		<div className={styles.Text} data-variant={variant}>
			{text}
		</div>
	);
};
