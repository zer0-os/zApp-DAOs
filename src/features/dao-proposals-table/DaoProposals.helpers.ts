import type { Proposal } from '@zero-tech/zdao-sdk';
import type { ProposalClosingStatus } from './DaoProposals.types';

import moment from 'moment';
import { isEmpty } from 'lodash';
import { ProposalState } from '@zero-tech/zdao-sdk';
import { secondsToDhms } from '../../lib/util/datetime';
import {
	PROPOSAL_FILTER_START_DATE,
	DEFAULT_TIMMER_EXPIRED_LABEL
} from './DaoProposals.constants';

/**
 * Sort proposals by active & ending time
 * @param proposals to sort
 * @param fromDate date string to list the proposals created from
 * @returns sorted proposals
 */
export const sortProposals = (
	proposals?: Proposal[],
	fromDate: string = PROPOSAL_FILTER_START_DATE
): Proposal[] => {
	if (!proposals?.length) {
		return [];
	}

	// 1. Filter by date first
	const filteredProposals = proposals.filter(
		(p) => p.created.getTime() > new Date(fromDate).getTime()
	);

	// 2. Sort by state and endting time
	const closedProposals = filteredProposals.filter(
		(p) => p.state === ProposalState.CLOSED || moment(p.end).isBefore(moment())
	);
	const activeProposals = filteredProposals.filter(
		(p) => !closedProposals.includes(p)
	);

	activeProposals.sort((a, b) =>
		moment(a.end).isAfter(moment(b.end)) ? 1 : -1
	);

	closedProposals.sort((a, b) =>
		moment(a.end).isBefore(moment(b.end)) ? 1 : -1
	);

	return [...activeProposals, ...closedProposals];
};

/**
 * Get proposal closing status
 * @param time miliseconds from now to proposal end time
 * @param isConcluded indicate proposal is concluded or not
 * @returns formatted proposal closing status
 */
export const getProposalClosingStatus = (
	time: number,
	isConcluded: boolean
): ProposalClosingStatus => {
	let status: ProposalClosingStatus = 'normal';
	if (!isConcluded && time < 1 * 3600 * 1000) {
		// less than 1 hour
		status = 'error';
	} else if (!isConcluded && time <= 24 * 3600 * 1000) {
		// less than 1 day
		status = 'warning';
	}

	return status;
};

/**
 * Check if proposal is from snapshot and have multiple choices
 * @param proposal to check
 * @returns true if the proposal is from snapshot with multiple choices
 */
export const isFromSnapshotWithMultipleChoices = (
	proposal: Proposal
): boolean => {
	/**
	 * 06/10/2022 Note - https://www.notion.so/zerotech/For-any-proposal-created-in-snapshot-display-the-Please-vote-on-this-proposal-in-Snapshot-footer-171742b056a445169bdaffe840d358a1
	 *
	 * To work around this in the MVP, lets just show the
	 * ‘‘Please vote on this proposal in Snapshot’ footer’ for ANY Snapshot proposals
	 *
	 */
	//  return !proposal.metadata && proposal.choices.length > 2;
	return !proposal.metadata;
};

/**
 * Format proposal status
 * @param proposal to format
 * @returns formatted proposal status string
 */
export const formatProposalStatus = (proposal?: Proposal): string => {
	if (proposal) {
		if (isFromSnapshotWithMultipleChoices(proposal)) {
			return '-';
		}

		const isClosed = proposal.state === ProposalState.CLOSED;

		if (!proposal.votes) return isClosed ? 'No Votes' : 'No Votes Yet';

		if (isEmpty(proposal.scores))
			return isClosed ? 'Expired' : 'More Votes Needed';

		if (proposal.scores[0] > proposal.scores[1]) {
			return isClosed ? 'Approved' : 'Approval Favoured';
		} else if (proposal.scores[0] < proposal.scores[1]) {
			return isClosed ? 'Denied' : 'Denial Favoured';
		} else {
			return 'More Votes Needed';
		}
	}

	return '';
};

/**
 * Format a time diff as humanized string
 * @param timeDiff to format
 * @returns formatted humanized string
 */
export const formatProposalEndTime = (timeDiff: number): string => {
	if (timeDiff < 0) {
		return DEFAULT_TIMMER_EXPIRED_LABEL;
	}

	return secondsToDhms(timeDiff / 1000);
};
