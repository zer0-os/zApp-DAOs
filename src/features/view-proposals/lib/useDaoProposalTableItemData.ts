import { useHistory, useLocation } from 'react-router-dom';

import { formatDuration, isBefore, intervalToDuration } from 'date-fns';
import removeMarkdown from 'markdown-to-text';
import { ProposalState, ProposalProperties } from '@zero-tech/zdao-sdk';
import { useTimer } from 'lib/hooks';
import { truncateString } from 'lib/util/string';
import {
	DEFAULT_TIMER_EXPIRED_LABEL,
	DEFAULT_TIMER_INTERVAL,
	formatProposalEndTime,
	getProposalClosingStatus,
	PROPOSAL_TITLE_MAX_CHARACTERS,
	ProposalClosingStatus,
	proposalStatus,
} from './';

//////////////////////////////////
// useDaoProposalsTableItemData //
//////////////////////////////////

export type DaoProposalsTableItemData = {
	title: string;
	description: string;
	status: string;
	endTime: string;
	isConcluded: boolean;
	closingStatus: ProposalClosingStatus;
	closingMessage: string;
	onClick: () => void;
};

export const useDaoProposalsTableItemData = (
	// SDK type is incorrect - end and start are number, not date
	proposal: Omit<Omit<ProposalProperties, 'end'>, 'start'> & {
		end: number;
		start: number;
	},
	isGridView = false,
): DaoProposalsTableItemData => {
	const history = useHistory();
	const location = useLocation();

	const isConcluded = isBefore(new Date(proposal.end * 1000), new Date());
	const isPending = proposal.state === ProposalState.PENDING;

	const targetDate = isPending ? proposal.start * 1000 : proposal.end * 1000;

	const { time } = useTimer(
		new Date(targetDate),
		isConcluded ? null : DEFAULT_TIMER_INTERVAL,
	);
	const status = proposalStatus(
		proposal.scores,
		proposal.state,
		proposal.quorum,
	);
	const endTime = formatProposalEndTime(time);
	const closingStatus = getProposalClosingStatus(time, isConcluded);
	const closingMessage = isConcluded
		? DEFAULT_TIMER_EXPIRED_LABEL
		: `${isPending ? 'Starting' : 'Closing'} in ${formatDuration(
				intervalToDuration({ start: new Date(), end: new Date(targetDate) }),
				{
					format: ['weeks', 'days', 'hours', 'minutes'],
				},
		  )}`;

	const onClick = () => {
		history.push(formatUrl(location.pathname, proposal.id), {
			isGridView,
		});
	};

	return {
		title: truncateString(proposal.title, PROPOSAL_TITLE_MAX_CHARACTERS),
		description: truncateString(removeMarkdown(proposal.body), 180),
		status,
		endTime,
		isConcluded,
		closingStatus,
		closingMessage,
		onClick,
	};
};

////////////////
// Format URL //
////////////////

/**
 * Formats the URL to include the proposal ID, and chops any duplicate slashes
 */
const formatUrl = (pathname: string, proposalId: string) => {
	if (pathname.endsWith('/')) {
		return pathname + proposalId;
	} else {
		return pathname + '/' + proposalId;
	}
};
