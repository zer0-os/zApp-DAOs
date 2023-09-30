import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { FC } from 'react';

import { convertAsset } from './lib/helpers';
import { useDao, useDaoAssets } from 'lib/hooks';

import { TableControls } from '../../ui';
import { DaoAssetsTableRow } from './DaoAssetsTableRow';
import { DaoAssetsTableCard } from './DaoAssetsTableCard';
import type { Column } from '@zero-tech/zui/components/AsyncTable';
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

import styles from './DaoAssetsTable.module.scss';

////////////////////
// DaoAssetsTable //
////////////////////

export type DaoAssetTableDataItem = {
	amount: string | number;
	decimals?: number;
	image: string;
	id: string;
	key: string;
	name: string;
	subtext: string;
	amountInUSD: string;
};

type DaoAssetsTableProps = {
	zna?: string;
};

const TABLE_COLUMNS: Column[] = [
	{ id: 'title', header: 'Asset', alignment: 'left' },
	{ id: 'qty', header: 'Quantity', alignment: 'right' },
	{ id: 'amount', header: 'Value (USD)', alignment: 'right' },
];

// @note: this value is being used in TableControls.module.scss - change in both places
const GRID_WIDTH_TOGGLE = 450;

export const DaoAssetsTable: FC<DaoAssetsTableProps> = ({ zna }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [view, setView] = useState<View>(View.TABLE);

	const { isLoading, isEmpty, tableData } = useDaoAssetsTableData(zna);

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
		<div className={styles.DaoAssetsTable} ref={containerRef}>
			{!isLoading && !isEmpty && (
				<>
					<div className={styles.ControlsWrapper}>
						<TableControls view={view} onChangeView={setView} />
					</div>

					<DaosAssetsView
						isGridView={view === View.GRID}
						tableData={tableData}
					/>
				</>
			)}
			{isLoading && (
				<TableStatusMessage
					className={styles.Message}
					status={TableStatus.LOADING}
					message={'Loading Assets...'}
				/>
			)}
			{isEmpty && (
				<TableStatusMessage
					className={styles.Message}
					status={TableStatus.EMPTY}
					message={'This DAO has no assets'}
				/>
			)}
		</div>
	);
};

///////////////////////////
// useDaoAssetsTableData //
///////////////////////////

const useDaoAssetsTableData = (zna?: string) => {
	const { isLoading, data: assets } = useDaoAssets(zna);
	const { data: dao } = useDao(zna);

	const isEmpty = !isLoading && !assets;

	const tableData: DaoAssetTableDataItem[] = useMemo(() => {
		if (!assets) return [];

		return assets.map(convertAsset);
	}, [assets]);

	return { isLoading, isEmpty, tableData, safeAddress: dao?.safeAddress };
};

/****************************
 * DaosAssetsView Row/Card  *
 ***************************/
interface DaoAssetsViewProps {
	isGridView: boolean;
	tableData: DaoAssetTableDataItem[];
}

const DaosAssetsView = ({ isGridView, tableData }: DaoAssetsViewProps) => {
	if (!tableData) {
		return <></>;
	}
	if (isGridView) {
		return (
			<div className={styles.DaosAssetsView}>
				<Grid className={styles.Grid}>
					{tableData?.map((asset) => (
						<DaoAssetsTableCard
							key={`dao-asset-card-${asset.id}`}
							data={asset}
						/>
					))}
				</Grid>
			</div>
		);
	} else {
		return (
			<div className={styles.DaosAssetsView}>
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
							{tableData?.map((asset) => (
								<DaoAssetsTableRow
									key={`dao-asset-row-${asset.id}`}
									data={asset}
								/>
							))}
						</Body>
					</Table>
				</div>
			</div>
		);
	}
};
