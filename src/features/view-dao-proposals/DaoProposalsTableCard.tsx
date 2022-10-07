import type { FC } from 'react';
import type { Proposal } from '@zero-tech/zdao-sdk';

import React from 'react';
import classNames from 'classnames/bind';
import { useDaoProposalsTableItemData } from './hooks';
import { ProposalClosingStatus } from './DaoProposals.constants';
import styles from './DaoProposalsTableCard.module.scss';

const cx = classNames.bind(styles);

type DaoProposalsTableCardProps = {
	proposal: Proposal;
};

export const DaoProposalsTableCard: FC<DaoProposalsTableCardProps> = ({
	proposal
}) => {
	const { title, description, status, closingStatus, closingMessage, onClick } =
		useDaoProposalsTableItemData(proposal, true);

	return (
		<div className={styles.Card} onClick={onClick}>
			{/* Title */}
			<h2 className={styles.Title}>{title}</h2>

			{/* Description */}
			<p className={styles.Description}>{description}</p>

			{/* Closing Message with humanized format (Chiclet) */}
			<div className={styles.Buttons}>
				<span
					className={cx(styles.Closing, {
						Warning: closingStatus === ProposalClosingStatus.WARNING,
						Error: closingStatus === ProposalClosingStatus.ERROR
					})}
				>
					{closingMessage}
				</span>

				{/* Status */}
				{status !== '-' && <span className={styles.Status}>{status}</span>}
			</div>
		</div>
	);
};
