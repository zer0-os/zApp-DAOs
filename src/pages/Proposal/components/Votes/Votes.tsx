import React, { useMemo } from 'react';

import type { zDAO, Proposal, Vote } from '@zero-tech/zdao-sdk';
import { useWeb3 } from '../../../../lib/hooks';
import { formatVotingPowerAmount } from '../../../../features/view-dao-proposals/DaoProposalsTable/lib';
import { getEtherscanUri } from '../../../../lib/util/network';

import { LoadingIndicator } from '@zero-tech/zui/components';
import { EtherscanLink } from '../../../../features/ui';
import { Approve, Deny } from '../Vote';

import styles from './Votes.module.scss';

///////////
// Votes //
///////////

type VotesProps = {
	dao?: zDAO;
	proposal?: Proposal;
	isLoading: boolean;
	votes: Vote[];
};

export const Votes: React.FC<VotesProps> = (props: VotesProps) => {
	return (
		<div className={styles.Container}>
			<div className={styles.Title}>Vote History</div>
			<div className={styles.Content}>
				<VoteList {...props} />
			</div>
		</div>
	);
};

//////////////
// VoteList //
//////////////

const VoteList = ({ dao, proposal, isLoading, votes }: VotesProps) => {
	const isSnapshotProposal = !proposal?.metadata;

	const { voteHistory: histories, hasVotes } = useVoteHistory({
		dao,
		proposal,
		votes
	});

	if (isLoading) {
		return <LoadingIndicator text="" />;
	}

	if (!proposal) {
		return null;
	}

	if (!hasVotes) {
		return <div className={styles.Empty}>No votes yet...</div>;
	}

	return (
		<>
			<HistoryHeader />
			<div className={styles.Histories}>
				{histories.map((history, i: number) => (
					<div className={styles.HistoryRow} key={i}>
						<VoterAddress address={history.address} />
						<VoteDirection
							isSnapshotProposal={isSnapshotProposal}
							voteOptions={proposal.choices}
							voteDirection={history.direction}
						/>
						<VotingPower votingPower={history.power} />
					</div>
				))}
			</div>
		</>
	);
};

///////////////////
// HistoryHeader //
///////////////////

const HistoryHeader = () => {
	return (
		<div className={styles.HistoryHeader}>
			<span className={styles.Address}>Address</span>
			<span className={styles.Direction}>Vote Direction</span>
			<span className={styles.Power}>Voting Power</span>
		</div>
	);
};

/////////////////
// VotingPower //
/////////////////

interface VotingPowerProps {
	votingPower: string;
}

const VotingPower = ({ votingPower }: VotingPowerProps) => {
	return (
		<span className={styles.Power}>
			<strong>Voting Power</strong>
			{votingPower}
		</span>
	);
};

//////////////////
// VoterAddress //
//////////////////

interface VoterAddressProps {
	address: string;
}

const VoterAddress = ({ address }: VoterAddressProps) => {
	const { chainId } = useWeb3();
	const etherscanUri = getEtherscanUri(chainId);

	return (
		<span className={styles.Address}>
			<strong>Address</strong>
			<EtherscanLink etherscanUri={etherscanUri} address={address} />
		</span>
	);
};

////////////////////
// Vote Direction //
////////////////////

interface VoteDirectionProps {
	isSnapshotProposal: boolean;
	voteOptions: Proposal['choices'];
	voteDirection: number;
}

const VoteDirection = ({
	isSnapshotProposal,
	voteOptions,
	voteDirection
}: VoteDirectionProps) => {
	return (
		<span className={styles.Direction}>
			<strong>Vote Direction</strong>
			{!isSnapshotProposal ? (
				voteDirection === 1 ? (
					<Approve>{voteOptions[voteDirection - 1]}</Approve>
				) : (
					<Deny>{voteOptions[voteDirection - 1]}</Deny>
				)
			) : (
				<span className={styles.SnapshotDirection}>
					{voteOptions[voteDirection - 1]}
				</span>
			)}
		</span>
	);
};

////////////////////
// useVoteHistory //
////////////////////

interface UseVoteHistoryParams {
	dao?: zDAO;
	proposal?: Proposal;
	votes: Vote[];
}

const useVoteHistory = ({ dao, proposal, votes }: UseVoteHistoryParams) => {
	const voteHistory = useMemo(() => {
		if (!proposal || !votes) {
			return [];
		}

		return votes.map((vote, index) => {
			return {
				id: index,
				address: vote.voter,
				direction: vote.choice,
				power: formatVotingPowerAmount(vote.power, dao?.votingToken)
			};
		});
	}, [dao, proposal, votes]);

	return {
		voteHistory,
		hasVotes: voteHistory && Boolean(voteHistory.length)
	};
};
