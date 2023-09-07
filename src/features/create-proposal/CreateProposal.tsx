import React, { FC } from 'react';

import type { CreateProposalProps } from './CreateProposal.types';
import { useCreateProposalContainerData } from './useCreateProposalContainerData';

import { BackLinkButton, ConnectWallet } from '../ui';
import { CreateProposalForm } from './CreateProposalForm';
import { Button, LoadingIndicator } from '@zero-tech/zui/components';

import styles from './CreateProposal.module.scss';
import { zDAO } from '@zero-tech/zdao-sdk';

export const CreateProposal: FC<CreateProposalProps> = ({ dao, zna }) => {
	const { toAllProposals, isWalletConnected } =
		useCreateProposalContainerData(zna);

	if (!isWalletConnected) {
		return (
			<ConnectWallet message={'Connect your wallet to create a proposal.'} />
		);
	}

	return (
		<div className={styles.Container}>
			<BackLinkButton label="All Proposals" to={toAllProposals} />
			<h1 className={styles.Header}>Create a Proposal</h1>
			<Content zna={zna} dao={dao} />
		</div>
	);
};

/////////////
// Content //
/////////////

interface ContentProps {
	zna: string;
	dao?: zDAO;
}

const Content = ({ zna, dao }: ContentProps) => {
	const { assets, onBack, isLoading } = useCreateProposalContainerData(zna);

	const isUserHoldingVotingToken = true;
	const isDaoHoldingERC20Asset = true;

	const wrapperClass = styles.Content;

	if (isLoading) {
		return (
			<div className={wrapperClass}>
				<LoadingIndicator
					className={styles.Loading}
					text="Loading DAO"
					spinnerPosition="left"
				/>
			</div>
		);
	}

	if (!isUserHoldingVotingToken || !isDaoHoldingERC20Asset) {
		return (
			<div className={wrapperClass}>
				<WarningMessage
					daoTitle={dao?.title}
					daoVotingTokenSymbol={dao?.votingToken.symbol}
					isUserHoldingVotingToken={isUserHoldingVotingToken}
					isDaoHoldingERC20Asset={isDaoHoldingERC20Asset}
				/>
				<Button onPress={onBack}>Back To Dao</Button>
			</div>
		);
	}

	return (
		<div className={wrapperClass}>
			<CreateProposalForm dao={dao} assets={assets} zna={zna} />
		</div>
	);
};

/////////////////////
// Warning Message //
/////////////////////

interface WarningMessageProps {
	daoTitle: string;
	daoVotingTokenSymbol: string;
	isUserHoldingVotingToken: boolean;
	isDaoHoldingERC20Asset: boolean;
}

const WarningMessage = ({
	daoTitle,
	daoVotingTokenSymbol,
	isUserHoldingVotingToken,
	isDaoHoldingERC20Asset,
}: WarningMessageProps) => {
	let content;

	if (!isDaoHoldingERC20Asset) {
		content = (
			<span data-variant={'warning'}>
				You cannot create a funding proposal as this DAO treasury does not hold
				any tokens to request.
			</span>
		);
	} else if (!isUserHoldingVotingToken) {
		content = (
			<span data-variant={'warning'}>
				To create a proposal, you need to be holding the {daoTitle} voting token{' '}
				<b>({daoVotingTokenSymbol})</b>.
			</span>
		);
	}

	return <div className={styles.LabelText}>{content}</div>;
};
