import React from 'react';

import { ProposalAttributes } from 'features/view-proposal-attributes';
import { formatProposalBody } from 'features/view-dao-proposals/lib';
import { useCurrentProposal } from './lib/useCurrentProposal';

import { MarkdownViewer, MaybeSkeletonText } from '@zero-tech/zui/components';
import { AllProposalsLink } from './components/AllProposalsLink';
import { VoteBar } from './components/VoteBar';
import { ProposalVoteList } from './components/ProposalVoteList';

import styles from './Proposal.module.scss';

export const Proposal = () => {
	const { data: proposal, isLoading: isLoadingProposal } = useCurrentProposal();

	return (
		<div className={styles.Proposal}>
			<AllProposalsLink />
			<MaybeSkeletonText
				as={'h1'}
				text={{
					text: proposal?.title,
					isLoading: isLoadingProposal,
				}}
				skeletonOptions={{ width: '50%' }}
			/>
			{proposal?.choices.length === 2 && (
				<VoteBar options={proposal.choices} scores={proposal.scores} />
			)}
			<ProposalAttributes proposal={proposal} isLoading={isLoadingProposal} />
			{proposal && (
				<MarkdownViewer
					className={styles.Markdown}
					text={formatProposalBody(proposal.body)}
				/>
			)}
			<hr />
			{proposal && <ProposalVoteList />}
		</div>
	);
};
