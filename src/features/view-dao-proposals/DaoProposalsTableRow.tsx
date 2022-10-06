import type { FC } from 'react';
import type { Proposal } from '@zero-tech/zdao-sdk';

import React from 'react';
import classNames from 'classnames/bind';
import { ProposalClosingStatus } from './DaoProposals.constants';
import { useDaoProposalsTableItemData } from './hooks';
import styles from './DaoProposalsTable.module.scss';

const cx = classNames.bind(styles);

type DaoProposalsTableRowProps = {
	proposal: Proposal;
};

export const DaoProposalsTableRow: FC<DaoProposalsTableRowProps> = ({
	proposal
}) => {
	const { title, status, endTime, isConcluded, closingStatus, onClick } =
		useDaoProposalsTableItemData(proposal);

	return (
		<tr className={styles.Row} onClick={onClick}>
			{/* Title */}
			<td className={styles.Title}>{title}</td>

			{/* Status */}
			<td className={styles.Status}>{status}</td>

			{/* Closes with humanized format */}
			<td
				className={cx(styles.Timer, {
					Concluded: isConcluded,
					Warning: closingStatus === ProposalClosingStatus.WARNING,
					Error: closingStatus === ProposalClosingStatus.ERROR
				})}
			>
				{endTime}
			</td>

			{/* Total votes count of proposal */}
			<td className={styles.Votes}>
				<p>{proposal.votes}</p>
			</td>
		</tr>
	);
};
