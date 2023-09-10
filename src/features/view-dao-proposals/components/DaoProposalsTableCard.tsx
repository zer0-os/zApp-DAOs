import React, { FC } from 'react';

import type { Proposal } from '@zero-tech/zdao-sdk';
import { ProposalClosingStatus, useDaoProposalsTableItemData } from '../lib';

import styles from './DaoProposalsTableCard.module.scss';

/////////////////////////////
// DAO Proposal Table Card //
/////////////////////////////

type DaoProposalsTableCardProps = {
	proposal: Proposal;
};

export const DaoProposalsTableCard: FC<DaoProposalsTableCardProps> = ({
	proposal,
}) => {
	const { title, description, status, closingStatus, closingMessage, onClick } =
		useDaoProposalsTableItemData(proposal, true);

	return (
		<div className={styles.Card} onClick={onClick}>
			<h2 className={styles.Title}>{title}</h2>
			<p className={styles.Description}>{description}</p>
			<StatusMessage
				closingMessage={closingMessage}
				closingStatus={closingStatus}
				status={status}
			/>
		</div>
	);
};

////////////////////
// Status Message //
////////////////////

interface StatusMessageProps {
	closingStatus: ProposalClosingStatus;
	closingMessage: string;
	status: string;
}

const StatusMessage = ({
	closingStatus,
	closingMessage,
	status,
}: StatusMessageProps) => {
	return (
		<div className={styles.Buttons}>
			<span className={styles.Closing} data-status={closingStatus}>
				{closingMessage}
			</span>
			{status !== '-' && <span className={styles.Status}>{status}</span>}
		</div>
	);
};
