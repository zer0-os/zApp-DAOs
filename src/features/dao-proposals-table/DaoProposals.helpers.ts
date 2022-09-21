import type { zDAO, Proposal, TokenMetaData, Token } from '@zero-tech/zdao-sdk';
import type { ProposalClosingStatus } from './DaoProposals.types';

import moment from 'moment';
import { isEmpty } from 'lodash';
import millify from 'millify';
import { formatUnits } from 'ethers/lib/utils';
import { ProposalState } from '@zero-tech/zdao-sdk';
import { formatFiat } from '../../lib/util/format';
import { secondsToDhms } from '../../lib/util/datetime';
import { DOLLAR_SYMBOL } from '../../lib/constants/currency';
import {
	PROPOSAL_FILTER_START_DATE,
	DEFAULT_TIMMER_EXPIRED_LABEL
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
 * Format the proposal body
 * @param body string to format
 * @returns formatted proposal bod
 */
export const formatProposalBody = (body = ''): string => {
	// 1. Convert ipfs:// formated image into https://snapshot image because snapshot image is not showing correctly
	let convertedBody = body;
	return convertedBody.replace(
		'ipfs://',
		'https://snapshot.mypinata.cloud/ipfs/'
	);
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
 * Get snapshot proposal link
 * @param proposal to get
 * @returns snapshot proposal link to vote
 */
export const getSnpashotProposalLink = (
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
		return DEFAULT_TIMMER_EXPIRED_LABEL;
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
	tokenMetaData?: TokenMetaData,
	asNumber = false
): string | number | null => {
	if (!tokenMetaData) return null;

	const { amount, decimals } = tokenMetaData;

	if (!amount || !decimals) return null;

	const calculatedAmount = Math.min(
		Number(formatUnits(amount, decimals)),
		Number.MAX_SAFE_INTEGER
	);

	if (!calculatedAmount) return null;

	if (asNumber) {
		return calculatedAmount;
	}

	const formattedAmount =
		calculatedAmount >= MILLIFY_THRESHOLD
			? millify(calculatedAmount, { precision: MILLIFY_PRECISION })
			: formatFiat(calculatedAmount);

	return formattedAmount + ' ' + tokenMetaData.symbol;
};

/**
 * Format a total amount in USD of proposal metadata
 * @param tokenMetaData to format
 * @returns formatted total ammount in USD of proposal metadata
 */
export const formatAmountInUSDOfTokenMetadata = (
	wildPriceUsd: number,
	tokenMetaData?: TokenMetaData
): string | null => {
	const amountInWILD = formatTotalAmountOfTokenMetadata(tokenMetaData, true);

	if (!amountInWILD) return null;

	return DOLLAR_SYMBOL + formatFiat(Number(amountInWILD) * wildPriceUsd);
};
