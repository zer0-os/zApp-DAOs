import React, {
	useState,
	useMemo,
	useRef,
	MutableRefObject,
	ReactNode
} from 'react';

import moment from 'moment';
import type { zDAO, Proposal } from '@zero-tech/zdao-sdk';
import { isEmpty } from 'lodash';
import { useWeb3, useTimer, useResize } from '../../../../lib/hooks';
import { secondsToDhms, formatDateTime } from '../../../../lib/util/datetime';
import { getEtherscanUri } from '../../../../lib/util/network';
import {
	isFromSnapshotWithMultipleChoices,
	formatProposalStatus,
	formatTotalAmountOfTokenMetadata,
	DEFAULT_TIMER_INTERVAL
} from '../../../../features/view-dao-proposals/DaoProposalsTable/lib';

import { EtherscanLink } from '../../../../features/ui';

import styles from './Attributes.module.scss';

const PROPOSAL_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT = {
	MOBILE: 3,
	TABLET: 5,
	DESKTOP: 7
};

////////////////
// Attributes //
////////////////

type AttributesProps = {
	dao: zDAO;
	proposal: Proposal;
};

export const Attributes: React.FC<AttributesProps> = ({ dao, proposal }) => {
	const containerRef = useRef(null);

	const [isListCollapsed, toggleIsListCollapsed] = useState<boolean>(true);

	const { visibleAttributes, initialHiddenAttributesCount } = useAttributeList({
		dao,
		proposal,
		containerRef,
		isListCollapsed
	});

	return (
		<div className={styles.Container} ref={containerRef}>
			<ul className={styles.Wrapper}>
				{visibleAttributes.map(
					(attribute: ProposalAttribute, index: number) => (
						<Attribute
							index={index}
							label={attribute.label}
							value={attribute.value}
							key={attribute.label + attribute.value}
						/>
					)
				)}

				{/* Show / Hide more button */}
				{initialHiddenAttributesCount > 0 && (
					<VisibilityButton
						isCollapsed={isListCollapsed}
						onClick={() => toggleIsListCollapsed(!isListCollapsed)}
					/>
				)}
			</ul>
		</div>
	);
};

///////////////
// Attribute //
///////////////

interface ProposalAttribute {
	label: string;
	value: ReactNode;
}

interface AttributeProps extends ProposalAttribute {
	index: number;
}

const Attribute = ({ index, label, value }: AttributeProps) => {
	return (
		<li
			className={`${styles.Attribute} ${
				index > 10 ? styles.SetOpacityAnimation : ''
			}`}
			key={label + value}
		>
			<span className={styles.Traits}>{label}</span>
			<span className={styles.Properties}>{value} </span>
		</li>
	);
};

///////////////////////
// Visibility Button //
///////////////////////

interface VisibilityButtonProps {
	isCollapsed: boolean;
	onClick: () => void;
}

const VisibilityButton = ({ isCollapsed, onClick }: VisibilityButtonProps) => {
	return (
		<div className={styles.ButtonContainer}>
			<button
				className={`${styles.ToggleAttributes} ${
					!isCollapsed ? styles.SetOpacityAnimation : ''
				}`}
				onClick={onClick}
			>
				{isCollapsed ? 'Show More' : 'Show Less'}
			</button>
		</div>
	);
};

//////////////////////
// useAttributeList //
//////////////////////

interface UseAttributeListParams {
	proposal: Proposal;
	dao: zDAO;
	containerRef: MutableRefObject<any>;
	isListCollapsed: boolean;
}

const useAttributeList = ({
	proposal,
	dao,
	containerRef,
	isListCollapsed
}: UseAttributeListParams) => {
	const isConcluded = checkIsConcluded(proposal.end);

	const { time: timeRemaining } = useTimer(
		proposal.end,
		isConcluded ? null : DEFAULT_TIMER_INTERVAL
	);

	const { attributes } = useFormattedAttributes({
		dao,
		proposal,
		timeRemaining,
		isConcluded
	});

	const { initialVisibleAttributesCount } = useVisibleAttributesCount({
		containerRef
	});

	const visibleAttributes: ProposalAttribute[] = useMemo(() => {
		if (!attributes) {
			return [];
		}

		const visibleAttributesCount = isListCollapsed
			? initialVisibleAttributesCount
			: attributes.length;

		return attributes.slice(0, visibleAttributesCount);
	}, [attributes, isListCollapsed, initialVisibleAttributesCount]);

	const initialHiddenAttributesCount: number = Math.max(
		attributes.length - initialVisibleAttributesCount,
		0
	);

	return {
		visibleAttributes,
		initialHiddenAttributesCount
	};
};

////////////////////////////
// useFormattedAttributes //
////////////////////////////

interface UseFormattedAttributesParams {
	proposal: Proposal;
	dao: zDAO;
	timeRemaining: number;
	isConcluded: boolean;
}

const useFormattedAttributes = ({
	proposal,
	dao,
	timeRemaining,
	isConcluded
}: UseFormattedAttributesParams) => {
	const { chainId } = useWeb3();
	const etherscanUri = getEtherscanUri(chainId);

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

	return { attributes };
};

///////////////////////////////
// useVisibleAttributesCount //
///////////////////////////////

interface UseVisibleAttributesCount {
	containerRef: MutableRefObject<any>;
}

const useVisibleAttributesCount = ({
	containerRef
}: UseVisibleAttributesCount) => {
	const [containerWidth, setContainerWidth] = useState<number>(0);

	useResize({
		onResize: setContainerWidth,
		targetRef: containerRef
	});

	const initialVisibleAttributesCount: number = useMemo(() => {
		const isTablet = containerWidth > 592 && containerWidth < 800;
		const isMobile = containerWidth <= 592;

		if (isMobile) return PROPOSAL_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT.MOBILE;
		if (isTablet) return PROPOSAL_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT.TABLET;
		return PROPOSAL_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT.DESKTOP;
	}, [containerWidth]);

	return { initialVisibleAttributesCount };
};

/////////////////
// isConcluded //
/////////////////

const checkIsConcluded = (date: Date) => {
	return moment(date).isBefore(moment());
};
