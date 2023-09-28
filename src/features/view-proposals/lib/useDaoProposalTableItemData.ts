import { useHistory, useLocation } from 'react-router-dom';

import { formatDuration, isBefore, intervalToDuration } from 'date-fns';
import removeMarkdown from 'markdown-to-text';
import type { Proposal } from '@zero-tech/zdao-sdk';
import { useTimer } from 'lib/hooks';
import { truncateString } from 'lib/util/string';
import {
	DEFAULT_TIMER_EXPIRED_LABEL,
	DEFAULT_TIMER_INTERVAL,
	formatProposalEndTime,
	formatProposalStatus,
	getProposalClosingStatus,
	PROPOSAL_TITLE_MAX_CHARACTERS,
	ProposalClosingStatus,
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
	proposal: Proposal,
	isGridView = false,
): DaoProposalsTableItemData => {
	const history = useHistory();
	const location = useLocation();

	const isConcluded = isBefore(new Date(proposal.end), new Date());

	const { time } = useTimer(
		proposal.end,
		isConcluded ? null : DEFAULT_TIMER_INTERVAL,
	);
	const status = formatProposalStatus(proposal);
	const endTime = formatProposalEndTime(time);
	const closingStatus = getProposalClosingStatus(time, isConcluded);
	const closingMessage = isConcluded
		? DEFAULT_TIMER_EXPIRED_LABEL
		: `Closing in ${formatDuration(
				intervalToDuration({ start: new Date(), end: new Date(proposal.end) }),
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
