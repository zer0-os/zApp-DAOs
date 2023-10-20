import { Fragment, useRef, useState } from 'react';
import { useInfiniteQuery } from 'react-query';

import { useCurrentDao, useResize, useWeb3 } from 'lib/hooks';
import { ProposalProperties } from '@zero-tech/zdao-sdk';

import { TableControls, ScrollTrigger } from 'features/ui';
import { NewProposalButton } from 'features/create-proposal';
import { Column } from '@zero-tech/zui/components/AsyncTable';
import {
	Body,
	Grid,
	Header,
	HeaderGroup,
	Table,
	TableStatus,
	TableStatusMessage,
	View,
} from '@zero-tech/zui/components';
import { Row } from './Row';
import { Card } from './Card';

const PROPOSAL_QUERY = `
query {
    proposals(
      first: FIRST
      skip: SKIP
      where: { space_in: [ "ENS" ], network: "NETWORK" }
      orderBy: "created"
      orderDirection: desc
    ) {
      id
      type
      author
      title
      body
      ipfs
      choices
      created
      start
      end
      state
      network
      snapshot
      scores_state
      scores
      votes
      quorum
    }
}
`;

import styles from './ProposalTable.module.scss';

////////////////////
// Proposal Table //
////////////////////

// @note: this value is being used in TableControls.module.scss - change in both places
const GRID_WIDTH_TOGGLE = 650;

const PAGE_SIZE = 15;

export interface ProposalTableProps {
	zna: string;
}

export const ProposalTable = ({ zna }: ProposalTableProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [view, setView] = useState<View>(View.GRID);

	const { dao, isLoading: isLoadingDao } = useCurrentDao();
	const { chainId } = useWeb3();

	const {
		data: sortedProposals,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
		isLoading: isLoadingProposals,
	} = useInfiniteQuery(
		['dao', 'proposals', { zna }],
		async ({ pageParam = 0 }) => {
			const from = pageParam * PAGE_SIZE;
			const count = PAGE_SIZE;

			const query = PROPOSAL_QUERY.replace('FIRST', count.toString())
				.replace('SKIP', from.toString())
				.replace('ENS', dao?.ens)
				.replace('NETWORK', chainId.toString());

			const res = await fetch('https://hub.snapshot.org/graphql', {
				method: 'POST',

				headers: {
					'Content-Type': 'application/json',
				},

				body: JSON.stringify({
					query,
				}),
			});

			const body = await res.json();
			const proposals = body?.data?.proposals as ProposalProperties[];

			return proposals;
		},
		{
			getNextPageParam: (lastPage, pages) => {
				if (lastPage.length === PAGE_SIZE) {
					return pages.length;
				}
			},
			enabled: Boolean(dao),
		},
	);

	useResize({
		targetRef: containerRef,
		onResize: (width) => {
			if (width <= GRID_WIDTH_TOGGLE) {
				setView(View.GRID);
			}
		},
	});

	const proposals = sortedProposals?.pages?.flat();
	const isLoading = isLoadingDao || isLoadingProposals;
	const isEmpty = !isLoading && proposals?.length === 0;

	return (
		<div className={styles.Proposals} ref={containerRef}>
			{isLoading && (
				<TableStatusMessage
					className={styles.Message}
					status={TableStatus.LOADING}
					message={'Loading Proposals'}
				/>
			)}
			{Boolean(proposals?.length) && (
				<Fragment>
					<div className={styles.Actions}>
						<NewProposalButton />
						<div className={styles.ControlsWrapper}>
							<TableControls view={view} onChangeView={setView} />
						</div>
					</div>
					{view === View.TABLE ? (
						<TableView proposals={proposals} />
					) : (
						<GridView proposals={proposals} />
					)}
				</Fragment>
			)}
			{isEmpty && (
				<div className={styles.Empty}>
					<TableStatusMessage
						className={styles.Message}
						status={TableStatus.EMPTY}
						message={'This DAO has no proposals.'}
					/>
					<NewProposalButton />
				</div>
			)}
			{hasNextPage && !isFetchingNextPage && (
				<ScrollTrigger
					onTrigger={() => {
						fetchNextPage();
					}}
				/>
			)}
		</div>
	);
};

////////////////
// Data Views //
////////////////

interface ViewProps {
	proposals: ProposalProperties[];
}

const TABLE_COLUMNS: Column[] = [
	{ id: 'title', header: 'Title', alignment: 'left' },
	{ id: 'status', header: 'Status', alignment: 'left' },
	{ id: 'closes', header: 'Next Phase', alignment: 'left' },
	{ id: 'votes', header: 'Votes', alignment: 'right' },
];

const TableView = ({ proposals }: ViewProps) => {
	return (
		<div className={styles.Table}>
			<Table>
				<HeaderGroup>
					{TABLE_COLUMNS.map((column) => (
						<Header key={column.id} alignment={column.alignment}>
							{column.header}
						</Header>
					))}
				</HeaderGroup>
				<Body>
					{proposals?.map((proposal) => (
						<Row proposal={proposal} key={`dao-proposal-row-${proposal.id}`} />
					))}
				</Body>
			</Table>
		</div>
	);
};

const GridView = ({ proposals }: ViewProps) => {
	return (
		<Grid className={styles.Grid}>
			{proposals?.map((proposal) => (
				<Card proposal={proposal} key={`dao-proposal-card-${proposal.id}`} />
			))}
		</Grid>
	);
};
