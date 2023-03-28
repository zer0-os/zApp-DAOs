import React, { FC } from 'react';

import type { Proposal } from '@zero-tech/zdao-sdk';
import { useDaoProposalsTableItemData, ProposalClosingStatus } from './lib';

import { TableData } from '@zero-tech/zui/components/AsyncTable/Column';

import classNames from 'classnames/bind';
import styles from './DaoProposalsTableRow.module.scss';

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
			<TableData alignment="left" className={styles.Title}>
				{title}
			</TableData>

			{/* Status */}
			<TableData alignment="left" className={styles.Status}>
				{status}
			</TableData>

			{/* Closes with humanized format */}
			<TableData
				alignment="left"
				className={cx(styles.Timer, {
					Concluded: isConcluded,
					Warning: closingStatus === ProposalClosingStatus.WARNING,
					Error: closingStatus === ProposalClosingStatus.ERROR
				})}
			>
				{endTime}
			</TableData>

			{/* Total votes count of proposal */}
			<TableData alignment="right" className={styles.Votes}>
				<p>{proposal.votes}</p>
			</TableData>
		</tr>
	);
};
