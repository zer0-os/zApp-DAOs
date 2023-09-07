import React, { FC, useEffect, useMemo, useRef, useState } from 'react';

import { useAllZnas, useAllDaos } from '../../../lib/hooks';
import type { zDAO } from '@zero-tech/zdao-sdk';

import { TableControls } from '../../ui';
import { DaosTableRow } from './DaosTableRow';
import { DaosTableCard } from './DaosTableCard';
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

import styles from './DaosTable.module.scss';

///////////////
// DaosTable //
///////////////

enum TABLE_KEYS {
	TITLE = 'title',
	ZNA = 'zna',
	DAO = 'dao',
}

const TABLE_COLUMNS: Column[] = [
	{ id: 'title', header: 'DAO', alignment: 'left' },
	{ id: 'amount', header: 'Value (USD)', alignment: 'right' },
];

export type DAOTableDataItem = {
	[TABLE_KEYS.TITLE]: string;
	[TABLE_KEYS.ZNA]: string;
	[TABLE_KEYS.DAO]: zDAO;
};

// @note: this value is being used in TableControls.module.scss - change in both places
const GRID_WIDTH_TOGGLE = 450;

export const DaosTable: FC = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [view, setView] = useState<View>(View.TABLE);

	const { tableData, isLoading, isEmpty } = useFormattedTableData();

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
			{!isLoading && !isEmpty && (
				<>
					<div className={styles.ControlsWrapper}>
						<TableControls view={view} onChangeView={setView} />
					</div>
					<DaosView isGridView={view === View.GRID} tableData={tableData} />
				</>
			)}
			{isLoading && (
				<TableStatusMessage
					className={styles.Message}
					status={TableStatus.LOADING}
					message={'Loading DAOs...'}
				/>
			)}
			{isEmpty && (
				<TableStatusMessage
					className={styles.Message}
					status={TableStatus.EMPTY}
					message={'No DAOs here or the zNA does not exist'}
				/>
			)}
		</div>
	);
};

///////////////////////////
// useFormattedTableData //
///////////////////////////

const useFormattedTableData = () => {
	const { isLoading: isLoadingZnas, data: znas } = useAllZnas();
	const { isLoading: isLoadingDaos, data: daos } = useAllDaos();

	const tableData: DAOTableDataItem[] = useMemo(() => {
		if (!znas?.length || !daos?.length || znas?.length !== daos?.length)
			return [];

		return znas.map((zna, index) => {
			const dao: zDAO = daos[index];

			return {
				[TABLE_KEYS.TITLE]: dao.title,
				[TABLE_KEYS.ZNA]: zna,
				[TABLE_KEYS.DAO]: dao,
			};
		});
	}, [znas, daos]);

	return {
		isLoading: isLoadingZnas || isLoadingDaos,
		isEmpty: !isLoadingZnas && !isLoadingDaos && !daos,
		tableData,
	};
};

/**********************
 * DaosView Row/Card  *
 *********************/
interface DaosViewProps {
	isGridView: boolean;
	tableData: DAOTableDataItem[];
}

const DaosView = ({ isGridView, tableData }: DaosViewProps) => {
	if (!tableData) {
		return <></>;
	}
	if (isGridView) {
		return (
			<div className={styles.DaoView}>
				<Grid className={styles.Grid}>
					{tableData?.map((dao) => (
						<DaosTableCard key={`dao-table-row-${dao.zna}`} daoData={dao} />
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
							{tableData?.map((dao) => (
								<DaosTableRow key={`dao-table-row-${dao.zna}`} daoData={dao} />
							))}
						</Body>
					</Table>
				</div>
			</div>
		);
	}
};
