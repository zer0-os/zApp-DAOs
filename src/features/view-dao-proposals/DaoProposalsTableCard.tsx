import type { FC } from 'react';
import type { Proposal } from '@zero-tech/zdao-sdk';

import React from 'react';
import classNames from 'classnames/bind';
import { useDaoProposalsTableItemData } from './hooks';
import { ProposalClosingStatus } from './DaoProposals.constants';

type DaoProposalsTableCardProps = {
	proposal: Proposal;
};

export const DaoProposalsTableCard: FC<DaoProposalsTableCardProps> = ({
	proposal
}) => {
	const {
		title,
		description,
		status,
		isConcluded,
		closingStatus,
		closingMessage,
		onClick
	} = useDaoProposalsTableItemData(proposal, true);

	// TODO:: This is mock render with real data to be used by zui grid card component
	return (
		<div onClick={onClick}>
			{/* Title */}
			<h2>{title}</h2>

			{/* Description */}
			<p>{description}</p>

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
			<p>{status}</p>
		</div>
	);
};
