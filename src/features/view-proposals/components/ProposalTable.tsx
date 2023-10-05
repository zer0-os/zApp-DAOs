import React, { Fragment, useRef, useState } from 'react';
import { useInfiniteQuery } from 'react-query';

import { useCurrentDao, useResize } from 'lib/hooks';
import { Proposal } from '@zero-tech/zdao-sdk';
import { useUserVotePower } from 'features/vote-on-proposal/lib/useUserVotePower';

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
	const [view, setView] = useState<View>(View.TABLE);

	const { dao, isLoading: isLoadingDao } = useCurrentDao();
	const { data: userVotePower } = useUserVotePower();

	const {
		data: sortedProposals,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
		isLoading: isLoadingProposals,
	} = useInfiniteQuery(
		['dao', 'proposals', { zna }],
		async ({ pageParam = 0 }) => {
			return dao.listProposals({
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
						<div>{userVotePower?.gt(0) && <NewProposalButton />}</div>
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
					{userVotePower?.gt(0) && <NewProposalButton />}
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
	proposals: Proposal[];
}

const TABLE_COLUMNS: Column[] = [
	{ id: 'title', header: 'Title', alignment: 'left' },
	{ id: 'status', header: 'Status', alignment: 'left' },
	{ id: 'closes', header: 'Closes', alignment: 'left' },
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
