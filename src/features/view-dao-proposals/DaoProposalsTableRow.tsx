import React, { FC, useMemo } from 'react';
import type { Proposal } from '@zero-tech/zdao-sdk';

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
	DEFAULT_TIMMER_INTERVAL,
	PROPOSAL_TITLE_LIMIT,
	PROPOSAL_TABLE_LOCATION_STATE_KEY,
	PROPOSAL_TABLE_LOCATION_STATE
} from './DaoProposals.constants';
import styles from './DaoProposalsTable.module.scss';

const cx = classNames.bind(styles);

type DaoProposalsTableRowProps = {
	proposal: Proposal;
};

export const DaoProposalsTableRow: FC<DaoProposalsTableRowProps> = ({
	proposal
}) => {
	const history = useHistory();
	const location = useLocation();

	const isConcluded = moment(proposal.end).isBefore(moment());

	const { time } = useTimer(
		proposal.end,
		isConcluded ? null : DEFAULT_TIMMER_INTERVAL
	);

	const closingStatus = useMemo(
		() => getProposalClosingStatus(time, isConcluded),
		[time, isConcluded]
	);

	const handleRowClick = () => {
		history.push(`${location.pathname}/${proposal.id}`, {
			[PROPOSAL_TABLE_LOCATION_STATE_KEY]: PROPOSAL_TABLE_LOCATION_STATE.ROW
		});
	};

	return (
		<tr className={styles.Row} onClick={handleRowClick}>
			{/* Title */}
			<td className={styles.Title}>
				{truncateString(proposal.title, PROPOSAL_TITLE_LIMIT)}
			</td>

			{/* Status */}
			<td className={styles.Status}>{formatProposalStatus(proposal)}</td>

			{/* Closes with humanized format */}
			<td
				className={cx(styles.Timer, {
					Concluded: isConcluded,
					Warning: closingStatus === 'warning',
					Error: closingStatus === 'error'
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
