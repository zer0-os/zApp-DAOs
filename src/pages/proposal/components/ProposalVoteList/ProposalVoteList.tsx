import React from 'react';

import { useInfiniteQuery } from 'react-query';
import ProposalClient from '@zero-tech/zdao-sdk/lib/client/ProposalClient';
import { truncateAddress } from '@zero-tech/zui/utils';
import { useCurrentProposal } from '../../lib/useCurrentProposal';

import {
	Table,
	Body,
	Header,
	HeaderGroup,
} from '@zero-tech/zui/components/Table';
import { TableData } from '@zero-tech/zui/components/AsyncTable/Column';
import { Button } from '@zero-tech/zui/components';

import styles from './ProposalVoteList.module.scss';

const PAGE_SIZE = 10;

export const ProposalVoteList = () => {
	const { zna, proposalId, data: proposal } = useCurrentProposal();

	const {
		data: voteHistory,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useInfiniteQuery(
		['dao', 'proposal', 'votes', { zna, proposalId }],
		async ({ pageParam = 0 }) => {
			return proposal.listVotes({
				from: pageParam * PAGE_SIZE,
				count: PAGE_SIZE,
			});
		},
		{
			getNextPageParam: (lastPage, pages) => {
				if (lastPage.length === PAGE_SIZE) {
					return pages.length;
				}
			},
			enabled: Boolean(proposal),
		},
	);

	const tokenSymbol = (proposal as ProposalClient)?.['options']?.strategies?.[0]
		?.params?.symbol;

	const handleOnClickLoadMore = () => {
		if (!isFetchingNextPage) {
			fetchNextPage();
		}
	};

	const hasNoVotes =
		voteHistory?.pages.length && voteHistory?.pages[0].length === 0;

	const sumOfScores = proposal?.scores.reduce((a, b) => a + b, 0);

	return (
		<div className={styles.Votes}>
			<h2>Vote History</h2>
			<Table>
				<HeaderGroup>
					<Header alignment={'left'}>Address</Header>
					<Header alignment={'right'}>Vote Direction</Header>
					<Header alignment={'right'}>
						Amount{tokenSymbol ? ` (${tokenSymbol})` : ''}
					</Header>
					<Header alignment={'right'}>Voting Power</Header>
				</HeaderGroup>
				<Body>
					{!hasNoVotes &&
						voteHistory?.pages.map((page) => {
							return (
								<React.Fragment key={page?.[0]?.voter}>
									{page?.map((vote) => (
										<tr key={vote.voter + vote.choice + vote.power}>
											<TableData alignment={'left'}>
												{truncateAddress(vote.voter)}
											</TableData>
											<TableData alignment={'right'}>
												{proposal?.choices[vote.choice - 1]}
											</TableData>
											<TableData alignment={'right'}>{vote.power}</TableData>
											<TableData alignment={'right'}>
												{sumOfScores === 0
													? '100%'
													: Math.round((vote.power / sumOfScores) * 100) + '%'}
											</TableData>
										</tr>
									))}
								</React.Fragment>
							);
						})}
				</Body>
			</Table>
			<div className={styles.LoadMoreButton}>
				{hasNoVotes && <span>No votes yet</span>}
				{Boolean(voteHistory?.pages.length) && hasNextPage && (
					<Button
						isLoading={isFetchingNextPage}
						variant={'text'}
						onPress={handleOnClickLoadMore}
					>
						Load More
					</Button>
				)}
			</div>
		</div>
	);
};
