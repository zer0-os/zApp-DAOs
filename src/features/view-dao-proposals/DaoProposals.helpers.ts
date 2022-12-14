import type { zDAO, Proposal, TokenMetaData, Token } from '@zero-tech/zdao-sdk';

import moment from 'moment';
import { isEmpty } from 'lodash';
import millify from 'millify';
import { formatUnits } from 'ethers/lib/utils';
import { ProposalState } from '@zero-tech/zdao-sdk';
import { formatFiat } from '../../lib/util/format';
import { secondsToDhms } from '../../lib/util/datetime';
import {
	PROPOSAL_FILTER_START_DATE,
	DEFAULT_TIMER_EXPIRED_LABEL,
	HOUR_IN_MILLISECONDS,
	DAY_IN_MILLISECONDS,
	ProposalClosingStatus
} from './DaoProposals.constants';

const MILLIFY_THRESHOLD = 1000000;
const MILLIFY_PRECISION = 3;

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

	// 2. Sorts an array of proposals by status, then by closing time (soonest to latest)
	const inactiveProposals = filteredProposals.filter(
		(p) => p.state === ProposalState.CLOSED || moment(p.end).isBefore(moment())
	);
	const activeProposals = filteredProposals.filter(
		(p) => !inactiveProposals.includes(p)
	);

	activeProposals.sort((a, b) =>
		moment(a.end).isAfter(moment(b.end)) ? 1 : -1
	);

	inactiveProposals.sort((a, b) =>
		moment(a.end).isBefore(moment(b.end)) ? 1 : -1
	);

	return [...activeProposals, ...inactiveProposals];
};

/**
 * Get proposal closing status by checking remaining proposal time
 * in miliseconds and return the status (normal | warning | error)
 *
 * @param time miliseconds from now to proposal end time
 * @param isConcluded indicate proposal is concluded or not
 * @returns formatted proposal closing status
 */
export const getProposalClosingStatus = (
	time: number,
	isConcluded: boolean
): ProposalClosingStatus => {
	if (!isConcluded && time < HOUR_IN_MILLISECONDS) {
		return ProposalClosingStatus.ERROR;
	} else if (!isConcluded && time <= DAY_IN_MILLISECONDS) {
		return ProposalClosingStatus.WARNING;
	}

	return ProposalClosingStatus.NORMAL;
};

/**
 * Format the proposal body
 * @param body string to format
 * @returns formatted proposal bod
 */
export const formatProposalBody = (body: string): string => {
	return body.replace('ipfs://', 'https://snapshot.mypinata.cloud/ipfs/');
};

/**
 * Check if proposal is from snapshot and have multiple choices
 * @param proposal to check
 * @returns true if the proposal is from snapshot with multiple choices
 */
export const isFromSnapshotWithMultipleChoices = (
	proposal: Proposal
): boolean => {
	return !proposal.metadata;
};

/**
 * Get snapshot proposal link
 * @param proposal to get
 * @returns snapshot proposal link to vote
 */
export const getSnapshotProposalLink = (
	dao: zDAO,
	proposal: Proposal
): string => {
	return `https://snapshot.org/#/${dao.ens}/proposal/${proposal.id}`;
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
		return DEFAULT_TIMER_EXPIRED_LABEL;
	}

	return secondsToDhms(timeDiff / 1000);
};

/**
 * Format a voting power amount
 * @param amount to format
 * @param symbol voting token symbol
 * @returns formatted ammount of voting power
 */
export const formatVotingPowerAmount = (
	amount: number,
	token?: Token,
	showSymbol?: boolean
): string | null => {
	if (!amount || !token) return null;

	const formattedAmount =
		amount >= MILLIFY_THRESHOLD
			? millify(amount, { precision: MILLIFY_PRECISION })
			: formatFiat(amount);

	const symbol =
		token.decimals > 0 ? token.symbol : 'NFT' + (amount > 1 ? 's' : '');

	return formattedAmount + (showSymbol ? ' ' + symbol : '');
};

/**
 * Format a total amount of proposal metadata
 * @param tokenMetaData to format
 * @returns formatted total ammount of proposal metadata
 */
export const formatTotalAmountOfTokenMetadata = (
	tokenMetaData?: TokenMetaData
): string => {
	if (!tokenMetaData) return null;

	const { amount, decimals } = tokenMetaData;

	if (!amount || !decimals) return null;

	const calculatedAmount = Math.min(
		Number(formatUnits(amount, decimals)),
		Number.MAX_SAFE_INTEGER
	);

	if (!calculatedAmount) return '-';

	const formattedAmount =
		calculatedAmount >= MILLIFY_THRESHOLD
			? millify(calculatedAmount, { precision: MILLIFY_PRECISION })
			: formatFiat(calculatedAmount);

	return formattedAmount + ' ' + tokenMetaData.symbol;
};
