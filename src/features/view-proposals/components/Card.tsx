import React, { FC } from 'react';

import type { Proposal } from '@zero-tech/zdao-sdk';
import { useDaoProposalsTableItemData } from '../lib';

import styles from './Card.module.scss';

/////////////////////////
// Proposal Table Card //
/////////////////////////

type CardProps = {
	proposal: Proposal;
};

export const Card: FC<CardProps> = ({ proposal }) => {
	const { title, description, status, closingStatus, closingMessage, onClick } =
		useDaoProposalsTableItemData(proposal, true);

	return (
		<div className={styles.Card} onClick={onClick}>
			<h2 className={styles.Title}>{title}</h2>
			<p className={styles.Description}>{description}</p>
			<div className={styles.Buttons}>
				<span className={styles.Closing} data-status={closingStatus}>
					{closingMessage}
				</span>
				{status !== '-' && <span className={styles.Status}>{status}</span>}
			</div>
		</div>
	);
};
