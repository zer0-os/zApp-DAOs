import React, { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { isNil } from 'lodash';
import type { Choice, Proposal } from '@zero-tech/zdao-sdk';
import { ProposalState } from '@zero-tech/zdao-sdk';
import { useCurrentDao, useWeb3, useUserProposalVoteData } from 'lib/hooks';
import {
	isFromSnapshotWithMultipleChoices,
	getSnapshotProposalLink,
} from 'features/view-dao-proposals/lib';

import { LoadingIndicator, Tooltip } from '@zero-tech/zui/components';
import { ConnectWallet } from 'features/ui';
import { VoteButtons, Approve, Deny } from './VoteButtons';
import { VoteStatus } from './Vote';

import externalIcon from '../../../../assets/external-link.svg';

import classNames from 'classnames';
import styles from './Vote.module.scss';

////////////////
// VoteAction //
////////////////

interface VoteActionProps {
	proposal: Proposal;
	userChoice: Choice;
	voteStatus: VoteStatus;
	onClickApprove: () => void;
	onClickDeny: () => void;
}

/**
 * Renders actions based on props.
 * @param proposal Proposal
 * @param userChoice the vote the user made, if any
 * @param voteStatus current progress of voting modal
 * @param onClickApprove event fired when approve is clicked
 * @param onClickDeny event fired when deny is clicked
 */
export const VoteAction: FC<VoteActionProps> = ({
	proposal,
	userChoice,
	voteStatus,
	onClickApprove,
	onClickDeny,
}) => {
	const { dao, zna } = useCurrentDao();
	const { account } = useWeb3();
	const { isLoading, data: { userVote, userVotingPower } = {} } =
		useUserProposalVoteData({ zna, proposalId: proposal.id });

	const vote = userChoice ?? userVote;

	if (!account) {
		return (
			<ConnectWallet
				message={
					proposal.state === ProposalState.ACTIVE
						? 'Connect Wallet To Vote'
						: 'Connect Wallet'
				}
			/>
		);
	}

	if (isLoading) {
		return null;
	}

	if (voteStatus === VoteStatus.PENDING) {
		return <LoadingIndicator spinnerPosition="left" text="" />;
	}

	if (!userVotingPower) {
		return <NoUserPowerMessage />;
	}

	if (isFromSnapshotWithMultipleChoices(proposal)) {
		const snapshotProposalLink = getSnapshotProposalLink(dao, proposal);
		return <SnapshotLink snapshotProposalLink={snapshotProposalLink} />;
	}

	if (!isNil(vote)) {
		return <VoteSummaryMessage vote={vote} />;
	}

	if (proposal.state === ProposalState.CLOSED) {
		const hasVotes = proposal.votes > 0;
		const isApproved = proposal.scores[0] > proposal.scores[1];

		return <FooterMessage hasVotes={hasVotes} isApproved={isApproved} />;
	}

	return (
		<VoteButtons onClickApprove={onClickApprove} onClickDeny={onClickDeny} />
	);
};

interface FooterProps {
	children: ReactNode;
}

const Footer = ({ children }: FooterProps) => {
	return <span className={styles.FooterText}>{children}</span>;
};

////////////////////////
// NoUserPowerMessage //
////////////////////////

const NoUserPowerMessage = () => {
	return (
		<Footer>
			Your wallet is not eligible to vote on this proposal
			<Tooltip
				content="In order to have voting power, you must hold the voting token at
					the time this proposal was created."
			/>
		</Footer>
	);
};

////////////////////////
// VoteSummaryMessage //
////////////////////////

const VoteSummaryMessage = ({ vote }: { vote: number }) => {
	return (
		<Footer>
			You voted to {vote === 1 ? <Approve>Approve</Approve> : <Deny>Deny</Deny>}{' '}
			this proposal
		</Footer>
	);
};

//////////////////
// SnapshotLink //
//////////////////

const SnapshotLink = ({
	snapshotProposalLink,
}: {
	snapshotProposalLink: string;
}) => {
	return (
		<span className={classNames(styles.FooterText, styles.Snapshot)}>
			Please vote on this proposal using
			<Link
				to={{ pathname: snapshotProposalLink }}
				target="_blank"
				rel="noreferrer"
				className={styles.SnapshotLink}
			>
				Snapshot
				<img alt="button icon" src={externalIcon} />
			</Link>
		</span>
	);
};

///////////////////
// FooterMessage //
///////////////////

interface FooterMessageProps {
	hasVotes: boolean;
	isApproved: boolean;
}

const FooterMessage = ({ hasVotes, isApproved }: FooterMessageProps) => {
	return (
		<Footer>
			Voting has concluded.{' '}
			{hasVotes && (
				<>
					This proposal is{' '}
					{isApproved ? <Approve>Approved</Approve> : <Deny>Denied</Deny>}
				</>
			)}
		</Footer>
	);
};
