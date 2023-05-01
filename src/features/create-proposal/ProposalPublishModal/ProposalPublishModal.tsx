import React, { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';

import type { Proposal } from '@zero-tech/zdao-sdk';
import type { ProposalPublishModalProps } from './ProposalPublishModal.types';
import { parseUnits } from 'ethers/lib/utils';
import { useDaoProposals, useWeb3 } from '../../../lib/hooks';
import {
	PUBLISH_MODAL_BODY,
	PUBLISH_MODAL_HEADER,
	Step
} from './ProposalPublishModal.constants';
import {
	DEFAULT_VOTE_CHOICES,
	DEFAULT_VOTE_DURATION_SECONDS,
	NEW_PROPOSAL_TWEET_OPTION
} from '../CreateProposal.constants';

import { DAO_CREATE_PROPOSAL } from '../../../pages';
import { Modal, Wizard } from '@zero-tech/zui/components';

import classNames from 'classnames/bind';
import styles from './ProposalPublishModal.module.scss';

const cx = classNames.bind(styles);

export const ProposalPublishModal: FC<ProposalPublishModalProps> = ({
	dao,
	isOpen,
	onClose,
	title,
	token,
	amount,
	recipient,
	body,
	zna
}) => {
	// Hooks
	const history = useHistory();
	const { account, provider } = useWeb3();
	const { refetch: refetchProposals } = useDaoProposals(zna);

	// States
	const [step, setStep] = useState<Step>(Step.Confirm);
	const [error, setError] = useState<string>();
	const [createdProposalId, setCreatedProposalId] = useState<Proposal['id']>();

	// Handlers
	const onPublishButtonClick = async () => {
		if (!dao || !account || !provider) {
			return;
		}

		const snapshot = await provider.getBlockNumber();
		if (!snapshot) return;

		setStep(Step.Publishing);
		setError(undefined);

		try {
			const newProposalId = await dao.createProposal(provider, account, {
				title,
				body,
				choices: DEFAULT_VOTE_CHOICES,
				duration: DEFAULT_VOTE_DURATION_SECONDS,
				snapshot,
				transfer: {
					sender: dao.safeAddress,
					recipient,
					amount: parseUnits(amount).toString(),
					...dao.votingToken,
					token
				}
			});

			refetchProposals();

			setCreatedProposalId(newProposalId);
			setStep(Step.Success);
		} catch (e: any) {
			console.error(e);
			if (e.code === 4001) {
				setError('Signature denied by wallet');
			} else {
				setError('Failed to create a proposal, try again');
			}
			setStep(Step.Confirm);
		}
	};

	const onViewProposalButtonClick = () => {
		if (createdProposalId) {
			const pathname = history.location.pathname.replace(
				`/${DAO_CREATE_PROPOSAL}`,
				`/${createdProposalId}`
			);

			history.push(pathname);
		}
	};

	const onTweetButtonClick = () => {
		if (createdProposalId) {
			const pathname = history.location.pathname.replace(
				`/${DAO_CREATE_PROPOSAL}`,
				`/${createdProposalId}`
			);
			const newProposalUrl = encodeURIComponent(
				`${location.origin}/${pathname}`
			);

			window.open(
				NEW_PROPOSAL_TWEET_OPTION.URL.replace(
					/NEW_PROPOSAL_TWEET_URL/g,
					newProposalUrl
				),
				'',
				NEW_PROPOSAL_TWEET_OPTION.OPTIONS
			);
		}
	};

	// Renders
	if (!isOpen) return null;

	return (
		<Modal open onOpenChange={onClose} className={styles.Modal}>
			<Wizard.Container
				header={PUBLISH_MODAL_HEADER[step]}
				className={styles.WizardContainer}
			>
				<div
					className={cx(styles.Message, {
						Success: step === Step.Success
					})}
				>
					{PUBLISH_MODAL_BODY[step]}
				</div>

				{error && <p className={styles.Error}>{error}</p>}

				{step === Step.Confirm && (
					<Wizard.Buttons
						isPrimaryButtonActive
						isSecondaryButtonActive
						primaryButtonText="Publish"
						secondaryButtonText="Return"
						onClickPrimaryButton={onPublishButtonClick}
						onClickSecondaryButton={onClose}
					/>
				)}

				{step === Step.Publishing && (
					<div className={styles.Loading}>
						<Wizard.Loading message="" />
					</div>
				)}

				{step === Step.Success && (
					<Wizard.Buttons
						isPrimaryButtonActive
						isSecondaryButtonActive
						primaryButtonText="View Proposal"
						secondaryButtonText="Tweet"
						onClickPrimaryButton={onViewProposalButtonClick}
						onClickSecondaryButton={onTweetButtonClick}
					/>
				)}
			</Wizard.Container>
		</Modal>
	);
};
