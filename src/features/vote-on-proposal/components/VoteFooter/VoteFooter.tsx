import { useCurrentDao, useWeb3 } from 'lib/hooks';
import { Button } from '@zero-tech/zui/components';
import { useCurrentProposal } from 'pages/proposal/lib/useCurrentProposal';

import { useVoteStore } from '../../lib/store';
import { VoteModal } from '../VoteModal';
import { useUserVote } from '../../lib/useUserVote';
import { useUserVotePower } from '../../lib/useUserVotePower';

import styles from './VoteFooter.module.scss';

export const VoteFooter = () => {
	const { account, connectWallet } = useWeb3();

	return (
		<footer className={styles.Footer}>
			<VoteModal />
			{account ? (
				<Vote />
			) : (
				<Button className={styles.Button} onPress={connectWallet}>
					Connect to wallet to vote
				</Button>
			)}
		</footer>
	);
};

const Vote = () => {
	const { dao } = useCurrentDao();
	const { data: proposal } = useCurrentProposal();
	const { data: userVote, isLoading: isLoadingUserVote } = useUserVote();
	const { data: userVotePower, isLoading: isLoadingUserVotePower } =
		useUserVotePower();
	const setChoice = useVoteStore((state) => state.setChoice);

	if (isLoadingUserVote || isLoadingUserVotePower) {
		return <div>Loading...</div>;
	}

	if (!userVotePower?.gt(0)) {
		return <div>Your wallet is not eligible to vote on this proposal</div>;
	}

	if (userVote) {
		return (
			<div className={styles.Vote}>
				<span>You voted for</span>
				{proposal?.choices[userVote.choice - 1]}
			</div>
		);
	}

	if (proposal?.choices.length <= 2) {
		return (
			<>
				{proposal?.choices.map((choice) => (
					<Button
						onPress={() => setChoice(choice)}
						key={choice}
						className={styles.Button}
					>
						{choice}
					</Button>
				))}
			</>
		);
	}

	return (
		<a
			href={`https://snapshot.org/#/${dao.ens}/proposal/${proposal.id}`}
			target={'_blank'}
			rel={'noreferrer'}
			style={{ color: 'var(--color-secondary-11)' }}
		>
			Vote on this proposal in Snapshot
		</a>
	);
};
