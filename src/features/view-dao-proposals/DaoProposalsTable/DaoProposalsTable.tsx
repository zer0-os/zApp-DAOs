import React, { FC, useEffect, useMemo, useRef, useState } from 'react';

import { sortProposals } from './lib';
import { useDaoProposals } from '../../../lib/hooks';
import { Proposal } from '@zero-tech/zdao-sdk';

import { TableControls } from '../../ui';
import { DaoProposalsTableRow } from './DaoProposalsTableRow';
import { DaoProposalsTableCard } from './DaoProposalsTableCard';
import { Column } from '@zero-tech/zui/components/AsyncTable';
import {
	Body,
	Grid,
	Header,
	HeaderGroup,
	Table,
	TableStatus,
	TableStatusMessage,
	View
} from '@zero-tech/zui/components';

import styles from './DaoProposalsTable.module.scss';

///////////////////////
// DaoProposalsTable //
///////////////////////

const TABLE_COLUMNS: Column[] = [
	{ id: 'title', header: 'Title', alignment: 'left' },
	{ id: 'status', header: 'Status', alignment: 'left' },
	{ id: 'closes', header: 'Closes', alignment: 'left' },
	{ id: 'votes', header: 'Votes', alignment: 'right' }
];

// @note: this value is being used in TableControls.module.scss - change in both places
const GRID_WIDTH_TOGGLE = 450;

export type DaoProposalsTableProps = {
	zna: string;
};

export const DaoProposalsTable: FC<DaoProposalsTableProps> = ({ zna }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [view, setView] = useState<View>(View.TABLE);

	const { isLoading, isEmpty, sortedProposals } = useProposalsTableData(zna);

	useEffect(() => {
		const resizeObserver = new ResizeObserver(() => {
			if (containerRef.current) {
				if (containerRef.current.offsetWidth <= GRID_WIDTH_TOGGLE) {
					setView(View.GRID);
				}
			}
		});
		resizeObserver.observe(containerRef.current);
		return () => resizeObserver.disconnect();
	}, [containerRef]);

	return (
		<div className={styles.DaoProposalsTable} ref={containerRef}>
			{!isLoading && !isEmpty && (
				<>
					<div className={styles.ControlsWrapper}>
						<TableControls view={view} onChangeView={setView} />
					</div>

					<DaosProposalsView
						isGridView={view === View.GRID}
						tableData={sortedProposals}
					/>
				</>
			)}
			{isLoading && (
				<TableStatusMessage
					className={styles.Message}
					status={TableStatus.LOADING}
					message={'Loading Proposals...'}
				/>
			)}
			{isEmpty && (
				<TableStatusMessage
					className={styles.Message}
					status={TableStatus.EMPTY}
					message={'This DAO has no proposals.'}
				/>
			)}
		</div>
	);
};

///////////////////////////
// useProposalsTableData //
///////////////////////////

const useProposalsTableData = (zna: string) => {
	const { isLoading: isLoadingProposals, data: proposalsData } =
		useDaoProposals(zna);

	const isEmpty = !isLoadingProposals && proposalsData?.length === 0;

	const sortedProposals = useMemo(
		() => sortProposals(proposalsData),
		[proposalsData]
	);

	return {
		sortedProposals,
		isEmpty,
		isLoading: isLoadingProposals
	};
};

/*******************************
 * DaosProposalsView Row/Card  *
 ******************************/
interface DaosProposalsViewProps {
	isGridView: boolean;
	tableData: Proposal[];
}

const DaosProposalsView = ({
	isGridView,
	tableData
}: DaosProposalsViewProps) => {
	if (!tableData) {
		return <></>;
	}
	if (isGridView) {
		return (
			<Grid className={styles.Grid}>
				{tableData?.map((proposal) => (
					<DaoProposalsTableCard
						proposal={proposal}
						key={`dao-proposal-card-${proposal.id}`}
					/>
				))}
			</Grid>
		);
	} else {
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
						{tableData?.map((proposal) => (
							<DaoProposalsTableRow
								proposal={proposal}
								key={`dao-proposal-row-${proposal.id}`}
							/>
						))}
					</Body>
				</Table>
			</div>
		);
	}
};
