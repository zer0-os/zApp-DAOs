import React, { useEffect, useRef, useState } from 'react';

import { useAllZnas } from 'lib/hooks';

import { TableControls } from 'features/ui';
import { DAOTableRow } from './DAOTableRow';
import { DAOTableCard } from './DAOTableCard';
import {
	Body,
	Column,
	Grid,
	Header,
	HeaderGroup,
	Table,
	TableStatus,
	TableStatusMessage,
	View,
} from '@zero-tech/zui/components';

import styles from './DAOTable.module.scss';

///////////////
// DaosTable //
///////////////

const TABLE_COLUMNS: Column[] = [
	{ id: 'title', header: 'DAO', alignment: 'left' },
	{ id: 'amount', header: 'Value (USD)', alignment: 'right' },
];

// @note: this value is being used in TableControls.module.scss - change in both places
const GRID_WIDTH_TOGGLE = 450;

export const DAOTable = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [view, setView] = useState<View>(View.TABLE);

	const { isLoading: isLoadingZnas, data: znas } = useAllZnas();

	const isEmpty = !isLoadingZnas && !znas?.length;

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
		<div className={styles.DaosTable} ref={containerRef}>
			{!isLoadingZnas && !isEmpty && (
				<>
					<div className={styles.ControlsWrapper}>
						<TableControls view={view} onChangeView={setView} />
					</div>
					<DaosView isGridView={view === View.GRID} znas={znas} />
				</>
			)}
			{isLoadingZnas && (
				<TableStatusMessage
					className={styles.Message}
					status={TableStatus.LOADING}
					message={'Loading all DAOs'}
				/>
			)}
			{isEmpty && (
				<TableStatusMessage
					className={styles.Message}
					status={TableStatus.EMPTY}
					message={'No daos here or the zNA does not exist'}
				/>
			)}
		</div>
	);
};

interface DaosViewProps {
	isGridView: boolean;
	znas: string[];
}

const DaosView = ({ isGridView, znas }: DaosViewProps) => {
	if (isGridView) {
		return (
			<div className={styles.DaoView}>
				<Grid className={styles.Grid}>
					{znas?.map((zna) => (
						<DAOTableCard key={`dao-table-row-${zna}`} zna={zna} />
					))}
				</Grid>
			</div>
		);
	} else {
		return (
			<div className={styles.DaoView}>
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
							{znas?.map((zna) => (
								<DAOTableRow key={`dao-table-row-${zna}`} zna={zna} />
							))}
						</Body>
					</Table>
				</div>
			</div>
		);
	}
};
