import React, { useState, useMemo, useRef } from 'react';

// - Library
import moment from 'moment';
import { isEmpty } from 'lodash';
import { useWeb3, useTimer, useResize } from '../../../lib/hooks';
import { secondsToDhms, formatDateTime } from '../../../lib/util/datetime';
import { getEtherscanUri } from '../../../lib/util/network';
import {
	isFromSnapshotWithMultipleChoices,
	formatProposalStatus,
	formatTotalAmountOfTokenMetadata,
	DEFAULT_TIMER_INTERVAL
} from '../../view-dao-proposals/DaoProposalsTable/lib';

// - Types
import type { zDAO, Proposal } from '@zero-tech/zdao-sdk';
import type { ProposalAttribute } from './ProposalAttributes.types';

// - Constants
import { PROPOSAL_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT } from './ProposalAttributes.constants';

// - Components
import { EtherscanLink } from '../../ui';

//- Style Imports
import styles from './ProposalAttributes.module.scss';

type ProposalAttributesProps = {
	dao: zDAO;
	proposal: Proposal;
};

export const ProposalAttributes: React.FC<ProposalAttributesProps> = ({
	dao,
	proposal
}) => {
	const containerRef = useRef(null);
	const { chainId } = useWeb3();

	const [isCollapsed, toggleCollapsed] = useState<boolean>(true);
	const [containerWidth, setContainerWidth] = useState<number>(0);

	useResize({
		onResize: setContainerWidth,
		targetRef: containerRef
	});

	const etherscanUri = getEtherscanUri(chainId);

	const initialVisibleAttributesCount: number = useMemo(() => {
		const isTablet = containerWidth > 592 && containerWidth < 800;
		const isMobile = containerWidth <= 592;

		if (isMobile) return PROPOSAL_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT.MOBILE;
		if (isTablet) return PROPOSAL_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT.TABLET;
		return PROPOSAL_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT.DESKTOP;
	}, [containerWidth]);

	const isConcluded = moment(proposal.end).isBefore(moment());

	const { time: timeRemaining } = useTimer(
		proposal.end,
		isConcluded ? null : DEFAULT_TIMER_INTERVAL
	);

	const attributes: ProposalAttribute[] = useMemo(() => {
		if (!dao || !proposal) {
			return [];
		}

		let parsedAttributes = [
			{
				label: 'Status',
				value: formatProposalStatus(proposal)
			},
			{
				label: 'Time Remaining',
				value: secondsToDhms(timeRemaining / 1000) || '-'
			},
			{
				label: 'Voting Started',
				value: formatDateTime(proposal.start, 'M/D/YYYY h:mm A Z') || '-'
			},
			{
				label: isConcluded ? 'Voting Ended' : 'Voting Ends',
				value: formatDateTime(proposal.end, 'M/D/YYYY h:mm A Z') || '-'
			},
			{
				label: 'Voting System',
				value: 'Single Choice'
			},
			{
				label: 'Execution Criteria',
				value: 'Absolute Majority'
			},
			{
				label: 'Votes Submitted',
				value: proposal.votes.toString()
			},
			{
				label: 'Creator',
				value: (
					<EtherscanLink
						etherscanUri={etherscanUri}
						address={proposal.author}
					/>
				)
			}
		];

		if (isFromSnapshotWithMultipleChoices(proposal)) {
			parsedAttributes = parsedAttributes.slice(1);
		} else {
			parsedAttributes.splice(2, 0, { label: 'Type', value: 'Funding' });
			parsedAttributes.splice(3, 0, {
				label: 'Amount',
				value: formatTotalAmountOfTokenMetadata(proposal.metadata)
			});
			if (proposal.metadata?.recipient) {
				parsedAttributes.splice(4, 0, {
					label: 'Recipient',
					value: (
						<EtherscanLink
							etherscanUri={etherscanUri}
							address={proposal.metadata.recipient}
						/>
					)
				});
			}
		}

		return parsedAttributes.filter(
			({ value }) => !isEmpty(value) && value !== '-'
		);
	}, [dao, proposal, etherscanUri, isConcluded, timeRemaining]);

	const initialHiddenAttributesCount: number = Math.max(
		attributes.length - initialVisibleAttributesCount,
		0
	);

	const visibleAttributes: ProposalAttribute[] = useMemo(() => {
		if (!attributes) {
			return [];
		}

		const visibleAttributesCount = isCollapsed
			? initialVisibleAttributesCount
			: attributes.length;

		return attributes.slice(0, visibleAttributesCount);
	}, [attributes, isCollapsed, initialVisibleAttributesCount]);

	if (visibleAttributes.length === 0) {
		return null;
	}

	return (
		<div className={styles.Container} ref={containerRef}>
			<ul className={styles.Wrapper}>
				{visibleAttributes.map(
					(attribute: ProposalAttribute, index: number) => (
						<li
							className={`${styles.Attribute} ${
								index > 10 ? styles.SetOpacityAnimation : ''
							}`}
							key={index}
						>
							<span className={styles.Traits}>{attribute.label}</span>
							<span className={styles.Properties}>{attribute.value} </span>
						</li>
					)
				)}

				{/* Show / Hide more button */}
				{initialHiddenAttributesCount > 0 && (
					<div className={styles.ButtonContainer}>
						<button
							className={`${styles.ToggleAttributes} ${
								!isCollapsed ? styles.SetOpacityAnimation : ''
							}`}
							onClick={() => toggleCollapsed(!isCollapsed)}
						>
							{isCollapsed ? 'Show More' : 'Show Less'}
						</button>
					</div>
				)}
			</ul>
		</div>
	);
};
