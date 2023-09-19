import { Proposal, ProposalState } from '@zero-tech/zdao-sdk';

import { Attribute, Attributes } from 'features/ui/Attributes/Attributes';
import { useWeb3 } from '../../../lib/hooks';
import { getEtherscanUri } from '../../../lib/util/network';
import { formatProposalStatus } from '../../view-dao-proposals/lib';
import React from 'react';
import { EtherscanLink } from '../../ui';
import { formatDateTime } from '../../../lib/util/datetime';
import { formatDistance } from 'date-fns/fp';
import ProposalClient from '@zero-tech/zdao-sdk/lib/client/ProposalClient';

export interface ProposalAttributesProps {
	proposal?: Proposal;
	isLoading?: boolean;
	votingTokenTicker?: string;
}

export const ProposalAttributes = ({
	proposal,
	isLoading,
}: ProposalAttributesProps) => {
	const { chainId } = useWeb3();

	const etherscanUri = getEtherscanUri(chainId ?? 1);
	const isClosed = proposal?.state === ProposalState.CLOSED;

	// Return type of getProposal is weird
	const tokenSymbol = (proposal as ProposalClient)?.['options']?.strategies?.[0]
		?.params?.symbol;

	return (
		<Attributes>
			<Attribute
				isLoading={isLoading}
				label={'Status'}
				value={proposal && formatProposalStatus(proposal)}
			/>
			<Attribute
				isLoading={isLoading}
				label={'Time Remaining'}
				value={
					!proposal || isClosed ? '-' : formatDistance(new Date(), proposal.end)
				}
			/>
			<Attribute
				isLoading={isLoading}
				label={'Voting Started'}
				value={proposal && formatDateTime(proposal.start)}
			/>
			<Attribute
				isLoading={isLoading}
				label={isClosed ? 'Voting Ended' : 'Voting Ends'}
				value={proposal && formatDateTime(proposal.end)}
			/>
			<Attribute
				isLoading={isLoading}
				label={'Voting System'}
				value={proposal?.type}
			/>
			<Attribute
				isLoading={isLoading}
				label={'Execution Criteria'}
				value={'Absolute Majority'}
			/>
			<Attribute
				isLoading={isLoading}
				label={'Votes Submitted'}
				value={`${proposal?.votes.toString()} ${tokenSymbol}`}
			/>
			<Attribute
				isLoading={isLoading}
				label={'Creator'}
				value={
					proposal?.author && (
						<EtherscanLink
							etherscanUri={etherscanUri}
							address={proposal.author}
						/>
					)
				}
			/>
		</Attributes>
	);
};
