import { Proposal, ProposalState } from '@zero-tech/zdao-sdk';

import { formatDistance } from 'date-fns/fp';
import { formatDateTime } from 'lib/util/datetime';
import { useWeb3 } from 'lib/hooks';
import { getEtherscanUri } from 'lib/util/network';
import { formatProposalStatus } from '../../view-proposals/lib';
import { kebabCaseToTitleCase } from '../lib/format';

import { Attribute, Attributes } from 'features/ui/Attributes/Attributes';
import { EtherscanLink } from 'features/ui';

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
	const isPending = proposal?.state === ProposalState.PENDING;

	return (
		<Attributes>
			<Attribute
				isLoading={isLoading}
				label={'Status'}
				value={proposal && formatProposalStatus(proposal)}
			/>
			{proposal?.state === ProposalState.ACTIVE && (
				<Attribute
					isLoading={isLoading}
					label={'Time Remaining'}
					value={
						!proposal || isClosed
							? '-'
							: formatDistance(new Date(), proposal.end)
					}
				/>
			)}
			<Attribute
				isLoading={isLoading}
				label={isPending ? 'Voting Starts' : 'Voting Started'}
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
				value={proposal?.type ? kebabCaseToTitleCase(proposal.type) : undefined}
			/>
			<Attribute
				isLoading={isLoading}
				label={'Execution Criteria'}
				value={'Absolute Majority'}
			/>
			{!isPending && (
				<Attribute
					isLoading={isLoading}
					label={'Voters'}
					value={proposal?.votes.toString()}
				/>
			)}
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
