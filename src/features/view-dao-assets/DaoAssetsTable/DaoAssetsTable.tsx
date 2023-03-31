import React, { useMemo } from 'react';
import type { FC } from 'react';

import { AsyncTable } from '@zero-tech/zui/components';
import type { Column } from '@zero-tech/zui/components/AsyncTable';
import { DaoAssetsTableRow } from './DaoAssetsTableRow';
import { DaoAssetsTableCard } from './DaoAssetsTableCard';

import { useDaoAssets } from '../../../lib/hooks';
import { convertAsset } from './lib/helpers';

import styles from './DaoAssetsTable.module.scss';

////////////////////
// DaoAssetsTable //
////////////////////

export type DaoAssetTableDataItem = {
	amount: string | number;
	decimals?: number;
	image: string;
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
	{ id: 'amount', header: 'Value (USD)', alignment: 'right' }
];

export const DaoAssetsTable: FC<DaoAssetsTableProps> = ({ zna }) => {
	const { isLoading, tableData } = useDaoAssetsTableData(zna);

	return (
		<div className={styles.Container}>
			<AsyncTable
				className={styles.Table}
				data={tableData}
				itemKey={'name'}
				columns={TABLE_COLUMNS}
				rowComponent={(data) => (
					<DaoAssetsTableRow data={data} key={`dao-asset-row-${data.name}`} />
				)}
				gridComponent={(data) => (
					<DaoAssetsTableCard data={data} key={`dao-asset-card-${data.name}`} />
				)}
				searchKey={{ key: 'name', name: 'name' }}
				isLoading={isLoading}
				isGridViewByDefault={false}
				emptyText={'This DAO has no assets'}
			/>
		</div>
	);
};

///////////////////////////
// useDaoAssetsTableData //
///////////////////////////

const useDaoAssetsTableData = (zna?: string) => {
	const { isLoading, data: assets } = useDaoAssets(zna);

	const tableData: DaoAssetTableDataItem[] = useMemo(() => {
		if (!assets) return [];

		return assets.map(convertAsset);
	}, [assets]);

	return { isLoading, tableData };
};
