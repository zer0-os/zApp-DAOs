import React, { FC, useState } from 'react';

import { truncateAddress } from '@zero-tech/zui/utils/formatting/addresses';
import type { Proposal, Choice } from '@zero-tech/zdao-sdk';
import {
	useCurrentDao,
	useWeb3,
	useUserProposalVoteData,
} from '../../../../lib/hooks';
import { formatVotingPowerAmount } from '../../../../features/view-dao-proposals/DaoProposalsTable/lib';

import { Modal, Wizard } from '@zero-tech/zui/components';
import { Approve, Deny } from './VoteButtons';

import classNames from 'classnames';
import styles from './Vote.module.scss';

///////////////
// VoteModal //
///////////////

enum VoteModalStep {
	CONFIRM,
	PENDING,
	ERROR,
	DECLINED,
}

interface VoteModalProps {
	proposal: Proposal;
	choice: Choice;
	onVote: () => Promise<void>;
	onClose: () => void;
	onComplete: () => void;
}

export const VoteModal: FC<VoteModalProps> = ({
	proposal,
	choice,
	onVote,
	onClose,
	onComplete,
}) => {
	const { dao, zna } = useCurrentDao();
	const { account } = useWeb3();
	const { data: { userVotingPower } = {} } = useUserProposalVoteData({
		zna,
		proposalId: proposal.id,
	});

	const [step, setStep] = useState<VoteModalStep>(VoteModalStep.CONFIRM);

	const onOpenChange = (isOpen: boolean) => {
		if (!isOpen) {
			onClose();
		}
	};

	/**
	 * Calls the vote function from props
	 * Changes to error state if function throws error
	 * Calls complete prop function if vote successful
	 */
	const vote = async () => {
		setStep(VoteModalStep.PENDING);
		try {
			await onVote();
			onComplete();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			console.error(e);
			setStep(e.code === 4001 ? VoteModalStep.DECLINED : VoteModalStep.ERROR);
		}
	};

	return (
		<Modal open={true} onOpenChange={onOpenChange}>
			<Wizard.Container header="Confirm Vote" className={styles.Modal}>
				{(step === VoteModalStep.CONFIRM ||
					step === VoteModalStep.DECLINED ||
					step === VoteModalStep.ERROR) && (
					<p>
						Are you sure you want to vote to{' '}
						{choice === 1 ? <Approve>approve</Approve> : <Deny>deny</Deny>} this
						proposal? This will be processed by the blockchain and cannot be
						reversed
					</p>
				)}
				<ul className={styles.Details}>
					<li>
						<span>Your Address</span>
						<span>{truncateAddress(account)}</span>
					</li>
					<li>
						<span>Your Vote</span>
						<span>
							{choice === 1 ? (
								<Approve>Approve Proposal</Approve>
							) : (
								<Deny>Deny Proposal</Deny>
							)}
						</span>
					</li>
					<li>
						<span>Your Voting Power</span>
						<span>
							{formatVotingPowerAmount(userVotingPower, dao?.votingToken, true)}
						</span>
					</li>
				</ul>

				{step === VoteModalStep.DECLINED && (
					<span className={classNames('error-text', styles.Error)}>
						Vote denied by wallet
					</span>
				)}
				{step === VoteModalStep.ERROR && (
					<span className={classNames('error-text', styles.Error)}>
						Failed to submit vote - please try again.
					</span>
				)}
				{(step === VoteModalStep.CONFIRM ||
					step === VoteModalStep.DECLINED ||
					step === VoteModalStep.ERROR) && (
					<Wizard.Buttons
						isPrimaryButtonActive
						isSecondaryButtonActive
						onClickPrimaryButton={vote}
						onClickSecondaryButton={onClose}
					/>
				)}
				{step === VoteModalStep.PENDING && (
					<Wizard.Loading message="Vote pending - please confirm signature in your wallet" />
				)}
			</Wizard.Container>
		</Modal>
	);
};
