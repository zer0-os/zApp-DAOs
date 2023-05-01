import React, { useState, FC, useCallback } from 'react';
import type { Choice, Proposal } from '@zero-tech/zdao-sdk';

import { useWeb3 } from '../../../../lib/hooks';
import { VoteModal } from './VoteModal';
import { VoteAction } from './VoteAction';

import styles from './Vote.module.scss';

export enum VoteStatus {
	NOT_STARTED,
	PENDING_CONFIRMATION,
	PENDING,
	COMPLETE,
	ERROR,
}

//////////
// Vote //
//////////

type VoteProps = {
	proposal: Proposal;
	onCompleteVoting: () => void;
};

export const Vote: FC<VoteProps> = ({ proposal, onCompleteVoting }) => {
	const {
		status,
		choice,
		completedVote,
		isUserConnected,
		handleVote,
		handleClose,
		handleComplete,
		handleChooseOption
	} = useVote({
		proposal,
		onCompleteVoting
	});

	return (
		<>
			{isUserConnected && choice && (
				<VoteModal
					proposal={proposal}
					choice={choice}
					onVote={handleVote}
					onClose={handleClose}
					onComplete={handleComplete}
				/>
			)}

			<footer className={styles.Container}>
				<VoteAction
					proposal={proposal}
					userChoice={completedVote}
					voteStatus={status}
					onClickApprove={() => handleChooseOption(1)}
					onClickDeny={() => handleChooseOption(2)}
				/>
			</footer>
		</>
	);
};

/////////////
// useVote //
/////////////

interface UseVoteParams {
	proposal: Proposal;
	onCompleteVoting: () => void;
}

const useVote = ({ proposal, onCompleteVoting }: UseVoteParams) => {
	const { account, provider } = useWeb3();

	const [status, setStatus] = useState<VoteStatus>(VoteStatus.NOT_STARTED);
	const [choice, setChoice] = useState<Choice | undefined>();
	const [completedVote, setCompletedVote] = useState<Choice | undefined>();

	const handleClose = useCallback(() => {
		setChoice(undefined);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleComplete = useCallback(() => {
		setCompletedVote(choice);
		handleClose();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleVote = useCallback(async () => {
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [provider, account, choice, proposal]);

	const handleChooseOption = useCallback(
		(choice: Choice) => {
			if (account) {
				setChoice(choice);
				setStatus(VoteStatus.PENDING_CONFIRMATION);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[account]
	);

	return {
		status,
		choice,
		completedVote,
		handleVote,
		handleClose,
		handleChooseOption,
		handleComplete,
		isUserConnected: Boolean(account)
	};
};
