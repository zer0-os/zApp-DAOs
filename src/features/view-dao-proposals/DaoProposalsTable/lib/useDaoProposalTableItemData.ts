// Types import
import type { Proposal } from '@zero-tech/zdao-sdk';

// React import
import { useHistory, useLocation } from 'react-router-dom';

// Hooks import
import { useTimer } from '../../../../lib/hooks';

// Library import
import moment, { duration } from 'moment';
import removeMarkdown from 'markdown-to-text';
import { truncateString } from '../../../../lib/util/string';
import {
	getProposalClosingStatus,
	formatProposalStatus,
	formatProposalEndTime,
	DEFAULT_TIMER_INTERVAL,
	DEFAULT_TIMER_EXPIRED_LABEL,
	PROPOSAL_TITLE_MAX_CHARACTERS,
	ProposalClosingStatus
} from './';

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
	isGridView = false
): DaoProposalsTableItemData => {
	const history = useHistory();
	const location = useLocation();

	const isConcluded = moment(proposal.end).isBefore(moment());

	const { time } = useTimer(
		proposal.end,
		isConcluded ? null : DEFAULT_TIMER_INTERVAL
	);
	const status = formatProposalStatus(proposal);
	const endTime = formatProposalEndTime(time);
	const closingStatus = getProposalClosingStatus(time, isConcluded);
	const closingMessage = isConcluded
		? DEFAULT_TIMER_EXPIRED_LABEL
		: 'Closing in ' + duration(moment(proposal.end).diff(moment())).humanize();

	const onClick = () => {
		history.push(`${location.pathname}/${proposal.id}`, {
			isGridView
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
		onClick
	};
};
