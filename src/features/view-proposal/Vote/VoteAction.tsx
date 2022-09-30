import type { FC } from 'react';
import type { Choice, Proposal } from '@zero-tech/zdao-sdk';

import React from 'react';
import { Link } from 'react-router-dom';
import { isNil } from 'lodash';
import classNames from 'classnames/bind';
import { ProposalState } from '@zero-tech/zdao-sdk';
//TODO:: replace Tooltip to InfoTooltip after zui version up
import { LoadingIndicator, Tooltip } from '@zero-tech/zui/components';
import { ConnectWallet } from '../../ui';
import {
	useCurrentDao,
	useWeb3,
	useUserProposalVoteData
} from '../../../lib/hooks';
import { VoteButtons, Approve, Deny } from './VoteButtons';
import { VoteStatus } from './Vote.constants';
import {
	isFromSnapshotWithMultipleChoices,
	getSnapshotProposalLink
} from '../../view-dao-proposals/DaoProposals.helpers';
import externalIcon from '../../../assets/external-link.svg';
import styles from './Vote.module.scss';

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
	onClickDeny
}) => {
	const { dao } = useCurrentDao();
	const { account } = useWeb3();
	const { isLoading, data: { userVote, userVotingPower } = {} } =
		useUserProposalVoteData(proposal);

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
		return (
			<span className={styles.FooterText}>
				Your wallet is not eligible to vote on this proposal
				<Tooltip
					content="In order to have voting power, you must hold the voting token at
					the time this proposal was created."
				/>
			</span>
		);
	}

	if (isFromSnapshotWithMultipleChoices(proposal)) {
		const snapshotProposalLink = getSnapshotProposalLink(dao, proposal);

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
	}

	if (!isNil(vote)) {
		return (
			<span className={styles.FooterText}>
				You voted to{' '}
				{vote === 1 ? <Approve>Approve</Approve> : <Deny>Deny</Deny>} this
				proposal
			</span>
		);
	}

	if (proposal.state === ProposalState.CLOSED) {
		const hasVotes = proposal.votes > 0;
		const isApproved = proposal.scores[0] > proposal.scores[1];

		return (
			<span className={styles.FooterText}>
				Voting has concluded.{' '}
				{hasVotes && (
					<>
						This proposal is{' '}
						{isApproved ? <Approve>Approved</Approve> : <Deny>Denied</Deny>}
					</>
				)}
			</span>
		);
	}

	return (
		<VoteButtons onClickApprove={onClickApprove} onClickDeny={onClickDeny} />
	);
};
