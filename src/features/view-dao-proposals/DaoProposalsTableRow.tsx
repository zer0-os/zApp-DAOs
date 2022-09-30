import type { FC } from 'react';
import type { DaoProposalsTableRowProps } from './DaoProposals.types';

import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import moment from 'moment';
import { useTimer } from '../../lib/hooks';
import { truncateString } from '../../lib/util/string';
import {
	getProposalClosingStatus,
	formatProposalStatus,
	formatProposalEndTime
} from './DaoProposals.helpers';
import {
	DEFAULT_TIMER_INTERVAL,
	PROPOSAL_TITLE_MAX_CHARACTERS,
	ProposalClosingStatus
} from './DaoProposals.constants';
import styles from './DaoProposalsTable.module.scss';

const cx = classNames.bind(styles);

export const DaoProposalsTableRow: FC<DaoProposalsTableRowProps> = ({
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

	const handleRowClick = () => {
		history.push(`${location.pathname}/${proposal.id}`, {
			isGridView: false
		});
	};

	return (
		<tr className={styles.Row} onClick={handleRowClick}>
			{/* Title */}
			<td className={styles.Title}>
				{truncateString(proposal.title, PROPOSAL_TITLE_MAX_CHARACTERS)}
			</td>

			{/* Status */}
			<td className={styles.Status}>{formatProposalStatus(proposal)}</td>

			{/* Closes with humanized format */}
			<td
				className={cx(styles.Timer, {
					Concluded: isConcluded,
					Warning: closingStatus === ProposalClosingStatus.WARNING,
					Error: closingStatus === ProposalClosingStatus.ERROR
				})}
			>
				{formatProposalEndTime(time)}
			</td>

			{/* Total votes count of proposal */}
			<td className={styles.Votes}>
				<p>{proposal.votes}</p>
			</td>
		</tr>
	);
};
