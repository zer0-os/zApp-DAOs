import type { FC } from 'react';
import type { Choice, Proposal } from '@zero-tech/zdao-sdk';

import React, { useState } from 'react';
import { useWeb3 } from '../../../../lib/hooks';
import { VoteModal } from './VoteModal';
import { VoteAction } from './VoteAction';
import { VoteStatus } from './Vote.constants';
import styles from './Vote.module.scss';

type VoteProps = {
	proposal: Proposal;
	onCompleteVoting: () => void;
};

export const Vote: FC<VoteProps> = ({ proposal, onCompleteVoting }) => {
	const { account, provider } = useWeb3();

	const [status, setStatus] = useState<VoteStatus>(VoteStatus.NOT_STARTED);
	const [choice, setChoice] = useState<Choice | undefined>();
	const [completedVote, setCompletedVote] = useState<Choice | undefined>();

	const onVote = async () => {
		if (choice && proposal && account) {
			setStatus(VoteStatus.PENDING);

			try {
				await proposal.vote(provider, account, choice);
				setStatus(VoteStatus.COMPLETE);
				onCompleteVoting();
			} catch (e) {
				console.error(e);
				setStatus(VoteStatus.ERROR);
				throw e;
			}
		} else {
			throw new Error('Invalid vote data');
		}
	};

	const onCloseModal = () => {
		setChoice(undefined);
	};

	const onCompleteModal = () => {
		setCompletedVote(choice);
		onCloseModal();
	};

	return (
		<>
			{choice && account && (
				<VoteModal
					proposal={proposal}
					choice={choice}
					onVote={onVote}
					onClose={() => setChoice(undefined)}
					onComplete={onCompleteModal}
				/>
			)}

			<footer className={styles.Container}>
				<VoteAction
					proposal={proposal}
					userChoice={completedVote}
					voteStatus={status}
					onClickApprove={() => setChoice(1)}
					onClickDeny={() => setChoice(2)}
				/>
			</footer>
		</>
	);
};
