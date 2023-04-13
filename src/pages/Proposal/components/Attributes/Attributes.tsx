import React, { ReactNode } from 'react';

import moment from 'moment';
import { useWeb3, useDaoProposal } from '../../../../lib/hooks';
import { secondsToDhms, formatDateTime } from '../../../../lib/util/datetime';
import { getEtherscanUri } from '../../../../lib/util/network';
import { formatProposalStatus } from '../../../../features/view-dao-proposals/DaoProposalsTable/lib';

import { EtherscanLink } from '../../../../features/ui';
import { Skeleton } from '@zero-tech/zui/components';

import styles from './Attributes.module.scss';

type AttributesProps = {
	proposalId: string;
	zna: string;
};

export const Attributes = ({ proposalId, zna }: AttributesProps) => {
	const { chainId } = useWeb3();
	const { data: proposal, isLoading: isLoadingProposal } = useDaoProposal({
		zna,
		proposalId
	});

	if (isLoadingProposal || !proposal) {
		return <AttributeSkeleton />;
	}

	const isConcluded = checkIsConcluded(proposal.end);
	const timeRemaining = moment(proposal.end).diff(moment());
	const etherscanUri = getEtherscanUri(chainId ?? 1);

	return (
		<AttributeWrapper>
			<Attribute label={'Status'} value={formatProposalStatus(proposal)} />
			<Attribute
				label={'Time Remaining'}
				value={secondsToDhms(timeRemaining / 1000) || '-'}
			/>
			<Attribute
				label={'Voting Started'}
				value={formatDateTime(proposal.start, 'M/D/YYYY h:mm A Z') || '-'}
			/>
			<Attribute
				label={isConcluded ? 'Voting Ended' : 'Voting Ends'}
				value={formatDateTime(proposal.end, 'M/D/YYYY h:mm A Z') || '-'}
			/>
			<Attribute label={'Voting System'} value={'Single Choice'} />
			<Attribute label={'Execution Criteria'} value={'Absolute Majority'} />
			<Attribute label={'Votes Submitted'} value={proposal.votes.toString()} />
			<Attribute
				label={'Creator'}
				value={
					<EtherscanLink
						etherscanUri={etherscanUri}
						address={proposal.author}
					/>
				}
			/>
		</AttributeWrapper>
	);
};

const AttributeSkeleton = () => {
	return (
		<AttributeWrapper>
			<Skeleton className={styles.AttributeHeight} />
			<Skeleton className={styles.AttributeHeight} />
			<Skeleton className={styles.AttributeHeight} />
			<Skeleton className={styles.AttributeHeight} />
			<Skeleton className={styles.AttributeHeight} />
			<Skeleton className={styles.AttributeHeight} />
			<Skeleton className={styles.AttributeHeight} />
		</AttributeWrapper>
	);
};

///////////////////////
// Attribute Wrapper //
///////////////////////

interface AttributeWrapperProps {
	children: ReactNode;
}

const AttributeWrapper = ({ children }: AttributeWrapperProps) => {
	return (
		<div className={styles.Container}>
			<ul className={styles.Wrapper}>{children}</ul>
		</div>
	);
};

///////////////
// Attribute //
///////////////

interface AttributeProps {
	label: string;
	value: ReactNode;
}

const Attribute = ({ label, value }: AttributeProps) => {
	return (
		<li className={styles.Attribute} key={label + value}>
			<span className={styles.Traits}>{label}</span>
			<span className={styles.Properties}>{value} </span>
		</li>
	);
};

/////////////
// Utility //
/////////////

const checkIsConcluded = (date: Date) => {
	return moment(date).isBefore(moment());
};
