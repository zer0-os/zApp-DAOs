import type { FC } from 'react';
import type { zDAO, ProposalId } from '@zero-tech/zdao-sdk';

import React, { useMemo, useEffect, useLayoutEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import { LoadingIndicator } from '@zero-tech/zui/components';
import {
	useDaoProposal,
	useProposalVotes,
	useUserProposalVoteData,
	useRedirect
} from '../../lib/hooks';
import {
	isFromSnapshotWithMultipleChoices,
	formatProposalBody
} from '../view-dao-proposals/DaoProposals.helpers';
import { BackLinkButton, MarkDownViewer } from '../ui';
import { Vote } from './Vote';
import { VoteBar } from './VoteBar';
import { VoteHistories } from './VoteHistories';
import { ProposalAttributes } from './ProposalAttributes';
import styles from './ProposalDetail.module.scss';

type ProposalDetailProps = {
	isLoadingDao: boolean;
	dao?: zDAO;
};

export const ProposalDetail: FC<ProposalDetailProps> = ({
	isLoadingDao,
	dao
}) => {
	// Hooks
	const history = useHistory();
	const { redirect } = useRedirect();
	const { proposalId } = useParams<{ proposalId: ProposalId }>();
	const {
		isLoading: isLoadingProposal,
		data: proposal,
		isError,
		refetch: refetchProposal
	} = useDaoProposal(proposalId, dao);
	const {
		isLoading: isLoadingVotes,
		data: votes,
		refetch: refetchProposalVotes
	} = useProposalVotes(proposal);
	const { refetch: refetchUserProposalVoteData } =
		useUserProposalVoteData(proposal);

	// Data
	const isLoading = isLoadingDao || isLoadingProposal;

	// Memoized data
	const toAllProposals = useMemo(() => {
		const pathname = history.location.pathname.replace(`/${proposalId}`, '');
		const state = cloneDeep(history.location.state);

		return {
			pathname,
			state
		};
	}, [history, proposalId]);

	// Callback
	const refetch = useCallback(() => {
		refetchProposal();
		refetchProposalVotes();
		refetchUserProposalVoteData();
	}, [refetchProposal, refetchProposalVotes, refetchUserProposalVoteData]);

	// Life cycle
	useLayoutEffect(() => {
		const nav = document.getElementById('dao-page-nav-tabs');

		nav.style.display = 'none';

		return () => {
			nav.style.display = 'block';
		};
	}, []);

	useEffect(() => {
		if (isError) {
			redirect(toAllProposals, 'Could not find a proposal');
		}
	}, [isError, toAllProposals, redirect]);

	// Render
	return (
		<div className={styles.Container}>
			{/* Back to All Proposals */}
			<BackLinkButton label="All Proposals" to={toAllProposals} />

			{/* Content */}
			<div className={styles.Content}>
				{isLoading && (
					<LoadingIndicator
						className={styles.Loading}
						text="Loading dao proposal"
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
						{dao && proposal && (
							<ProposalAttributes dao={dao} proposal={proposal} />
						)}

						{/* Proposal body (Markdown content) */}
						<MarkDownViewer
							text={formatProposalBody(proposal?.body)}
							className={styles.MarkDownViewerContent}
						/>

						{/* Vote histories */}
						<VoteHistories
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
