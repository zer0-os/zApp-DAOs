import type { FC } from 'react';
import React, { useMemo } from 'react';

import {
	AsyncTable,
	TableStatus,
	TableStatusMessage
} from '@zero-tech/zui/components';
import type { Column } from '@zero-tech/zui/components/AsyncTable';
import { DaoAssetsTableRow } from './DaoAssetsTableRow';
import { DaoAssetsTableCard } from './DaoAssetsTableCard';

import { useDao, useDaoAssets, useEtherscanUrl } from '../../../lib/hooks';
import { convertAsset } from './lib/helpers';

import styles from './DaoAssetsTable.module.scss';
import { IconArrowUpRight } from '@zero-tech/zui/icons';

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
	const { isLoading, tableData, safeAddress } = useDaoAssetsTableData(zna);
	const { etherscanUrl } = useEtherscanUrl();

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
			<TableStatusMessage
				status={TableStatus.ERROR}
				message={
					<div className={styles.Warning}>
						<span>Not all DAO collectibles may show in the list above</span>
						<a
							target={'_blank'}
							rel={'noreferrer'}
							href={etherscanUrl + 'tokenholdings?a=' + safeAddress}
						>
							Full full asset collection <IconArrowUpRight size={16} />
						</a>
					</div>
				}
			/>
		</div>
	);
};

///////////////////////////
// useDaoAssetsTableData //
///////////////////////////

const useDaoAssetsTableData = (zna?: string) => {
	const { isLoading, data: assets } = useDaoAssets(zna);
	const { data: dao } = useDao(zna);

	const tableData: DaoAssetTableDataItem[] = useMemo(() => {
		if (!assets) return [];

		return assets.map(convertAsset);
	}, [assets]);

	return { isLoading, tableData, safeAddress: dao?.safeAddress };
};
