import React, { FC, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { cloneDeep } from 'lodash';
import type { ProposalId } from '@zero-tech/zdao-sdk';
import { isFromSnapshotWithMultipleChoices } from '../../features/view-dao-proposals/DaoProposalsTable/lib';
import { useCurrentDao } from '../../lib/hooks';
import { useProposalPageData } from './lib';

import { BackLinkButton } from '../../features/ui';
import { Attributes, Body, Title, Vote, VoteBar, Votes } from './components';

import styles from './Proposal.module.scss';
import moment from 'moment';

//////////////
// Proposal //
//////////////

export const Proposal: FC = () => {
	const { proposalId } = useParams<{ proposalId: ProposalId }>();
	const { zna } = useCurrentDao();

	const { isLoadingProposal, isLoadingVotes, proposal, votes, refetch, dao } =
		useProposalPageData({ proposalId, zna });

	const shouldShowVoteBar =
		proposal &&
		!isFromSnapshotWithMultipleChoices(proposal) &&
		votes?.length > 0;

	return (
		<div className={styles.Container}>
			<AllProposalsButton />

			<div className={styles.Content}>
				<Title title={proposal?.title} />
				{shouldShowVoteBar && <VoteBar votes={votes} />}
				<Attributes proposalId={proposalId} zna={zna} />
				<hr />
				<Body bodyMarkdown={proposal?.body} />
				<hr />
				<Votes
					dao={dao}
					proposal={proposal}
					isLoading={isLoadingProposal || isLoadingVotes}
					votes={votes}
				/>
			</div>
			{!isLoadingProposal && moment(proposal.end).isAfter(moment()) && (
				<Vote proposal={proposal} onCompleteVoting={refetch} />
			)}
		</div>
	);
};

//////////////////////////
// All Proposals Button //
//////////////////////////

const AllProposalsButton = () => {
	const history = useHistory();

	const toAllProposals = useMemo(() => {
		const pathname = history.location.pathname.replace(
			/\/proposals\/.*/,
			'/proposals/'
		);
		const state = cloneDeep(history.location.state);

		return {
			pathname,
			state
		};
	}, [history]);

	return <BackLinkButton label="All Proposals" to={toAllProposals} />;
};
