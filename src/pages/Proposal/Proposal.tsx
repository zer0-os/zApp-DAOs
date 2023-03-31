import React, { FC, useCallback, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import type { ProposalId } from '@zero-tech/zdao-sdk';
import { cloneDeep } from 'lodash';
import {
	useCurrentDao,
	useDao,
	useDaoProposal,
	useProposalVotes
} from '../../lib/hooks';
import {
	formatProposalBody,
	isFromSnapshotWithMultipleChoices
} from '../../features/view-dao-proposals/DaoProposalsTable/lib';
import { BackLinkButton } from '../../features/ui';

import { LoadingIndicator, MarkdownViewer } from '@zero-tech/zui/components';
import { Attributes, Vote, VoteBar, Votes } from './components';

import styles from './Proposal.module.scss';

export const Proposal: FC = () => {
	const { proposalId } = useParams<{ proposalId: ProposalId }>();
	const { zna } = useCurrentDao();

	const { data: dao } = useDao(zna);

	const {
		isLoading: isLoadingProposal,
		data: proposal,
		refetch: refetchProposal
	} = useDaoProposal({
		proposalId,
		zna
	});

	const {
		isLoading: isLoadingVotes,
		data: votes,
		refetch: refetchProposalVotes
	} = useProposalVotes({
		proposalId,
		zna
	});

	const isLoading = isLoadingProposal;

	const refetch = useCallback(() => {
		refetchProposal();
		refetchProposalVotes();
		// refetchUserProposalVoteData();
	}, [refetchProposal, refetchProposalVotes]);

	return (
		<div className={styles.Container}>
			{/* Back to All Proposals */}
			<AllProposalsButton />

			{/* Content */}
			<div className={styles.Content}>
				{isLoading && (
					<LoadingIndicator
						className={styles.Loading}
						text="Loading DAO Proposals"
						spinnerPosition="left"
					/>
				)}

				{!isLoading && (
					<div className={styles.Wrapper}>
						{/* Title */}
						<h1 className={styles.Title}>{proposal?.title}</h1>

						{/* Vote bar */}
						{proposal &&
							!isFromSnapshotWithMultipleChoices(proposal) &&
							votes?.length > 0 && <VoteBar votes={votes} />}

						{/* Proposal attributes */}
						{dao && proposal && <Attributes dao={dao} proposal={proposal} />}

						{/* Proposal body (Markdown content) */}
						<MarkdownViewer text={formatProposalBody(proposal?.body)} />

						{/* Vote histories */}
						<Votes
							dao={dao}
							proposal={proposal}
							isLoading={isLoading || isLoadingVotes}
							votes={votes}
						/>
					</div>
				)}
			</div>

			{/* Footer */}
			{!isLoading && proposal && (
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
