import React from 'react';

import moment from 'moment';
import { useWeb3, useDaoProposal } from '../../../../lib/hooks';
import { secondsToDhms, formatDateTime } from '../../../../lib/util/datetime';
import { getEtherscanUri } from '../../../../lib/util/network';
import { formatProposalStatus } from '../../../../features/view-dao-proposals/DaoProposalsTable/lib';

import { EtherscanLink } from '../../../../features/ui';

import {
	Attribute,
	Attributes as AttributeWrapper,
} from '../../../../features/ui/Attributes/Attributes';

type AttributesProps = {
	proposalId: string;
	zna: string;
};

export const Attributes = ({ proposalId, zna }: AttributesProps) => {
	const { chainId } = useWeb3();
	const { data: proposal, isLoading: isLoadingProposal } = useDaoProposal({
		zna,
		proposalId,
	});

	const etherscanUri = getEtherscanUri(chainId ?? 1);

	const isConcluded = proposal ? checkIsConcluded(proposal.end) : undefined;
	const timeRemaining = proposal
		? moment(proposal.end).diff(moment())
		: undefined;

	return (
		<AttributeWrapper>
			<Attribute
				isLoading={isLoadingProposal}
				label={'Status'}
				value={proposal && formatProposalStatus(proposal)}
			/>
			<Attribute
				isLoading={isLoadingProposal}
				label={'Time Remaining'}
				value={(proposal && secondsToDhms(timeRemaining / 1000)) || '-'}
			/>
			<Attribute
				isLoading={isLoadingProposal}
				label={'Voting Started'}
				value={
					(proposal && formatDateTime(proposal.start, 'M/D/YYYY h:mm A Z')) ||
					'-'
				}
			/>
			<Attribute
				isLoading={isLoadingProposal}
				label={isConcluded ? 'Voting Ended' : 'Voting Ends'}
				value={
					(proposal && formatDateTime(proposal.end, 'M/D/YYYY h:mm A Z')) || '-'
				}
			/>
			<Attribute
				isLoading={isLoadingProposal}
				label={'Voting System'}
				value={'Single Choice'}
			/>
			<Attribute
				isLoading={isLoadingProposal}
				label={'Execution Criteria'}
				value={'Absolute Majority'}
			/>
			<Attribute
				isLoading={isLoadingProposal}
				label={'Votes Submitted'}
				value={proposal && proposal.votes.toString()}
			/>
			<Attribute
				isLoading={isLoadingProposal}
				label={'Creator'}
				value={
					proposal && (
						<EtherscanLink
							etherscanUri={etherscanUri}
							address={proposal.author}
						/>
					)
				}
			/>
		</AttributeWrapper>
	);
};

/////////////
// Utility //
/////////////

const checkIsConcluded = (date: Date) => {
	return moment(date).isBefore(moment());
};
