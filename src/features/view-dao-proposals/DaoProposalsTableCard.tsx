import type { FC } from 'react';
import type { Proposal } from '@zero-tech/zdao-sdk';

import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import moment, { duration } from 'moment';
import removeMarkdown from 'markdown-to-text';
import { useTimer } from '../../lib/hooks';
import { truncateString } from '../../lib/util/string';
import {
	getProposalClosingStatus,
	formatProposalStatus
} from './DaoProposals.helpers';
import {
	DEFAULT_TIMER_INTERVAL,
	DEFAULT_TIMER_EXPIRED_LABEL,
	PROPOSAL_TITLE_MAX_CHARACTERS,
	ProposalClosingStatus
} from './DaoProposals.constants';

type DaoProposalsTableCardProps = {
	proposal: Proposal;
};

export const DaoProposalsTableCard: FC<DaoProposalsTableCardProps> = ({
	proposal
}) => {
	const history = useHistory();
	const location = useLocation();

	const isConcluded = moment(proposal.end).isBefore(moment());

	const { time } = useTimer(
		proposal.end,
		isConcluded ? null : DEFAULT_TIMER_INTERVAL
	);

	const closingStatus = getProposalClosingStatus(time, isConcluded);
	const closingMessage = isConcluded
		? DEFAULT_TIMER_EXPIRED_LABEL
		: 'Closing in ' + duration(moment(proposal.end).diff(moment())).humanize();

	const handleCardClick = () => {
		history.push(`${location.pathname}/${proposal.id}`, {
			isGridView: true
		});
	};

	// TODO:: This is mock render with real data to be used by zui grid card component
	return (
		<div onClick={handleCardClick}>
			{/* Title */}
			<h2>{truncateString(proposal.title, PROPOSAL_TITLE_MAX_CHARACTERS)}</h2>

			{/* Description */}
			<p>{truncateString(removeMarkdown(proposal.body), 180)}</p>

			{/* Closing Message with humanized format (Chiclet) */}
			<span
				className={classNames({
					Concluded: isConcluded,
					Warning: closingStatus === ProposalClosingStatus.WARNING,
					Error: closingStatus === ProposalClosingStatus.ERROR
				})}
			>
				{closingMessage}
			</span>

			{/* Status */}
			<p>{formatProposalStatus(proposal)}</p>
		</div>
	);
};
