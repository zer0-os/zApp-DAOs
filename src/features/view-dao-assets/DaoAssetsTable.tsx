import type { FC } from 'react';
import type { zDAO } from '@zero-tech/zdao-sdk';
import type { DaoAssetTableDataItem } from './DaoAssetsTable.types';

import React, { useMemo } from 'react';

import { AsyncTable } from '@zero-tech/zui/components';
import { DaoAssetsTableRow } from './DaoAssetsTableRow';
import { DaoAssetsTableCard } from './DaoAssetsTableCard';

import { useDaoAssets } from '../../lib/hooks';
import { convertAsset } from './DaoAssetsTable.helpers';

import { TABLE_COLUMNS } from './DaoAssetsTable.constants';

import styles from './DaoAssetsTable.module.scss';

type DaoAssetsTableProps = {
	isLoadingDao: boolean;
	dao?: zDAO;
};

export const DaoAssetsTable: FC<DaoAssetsTableProps> = ({
	isLoadingDao,
	dao
}) => {
	const { isLoading, data: assets } = useDaoAssets(dao);

	const tableData: DaoAssetTableDataItem[] = useMemo(() => {
		if (!assets) return [];

		return assets.map(convertAsset);
	}, [assets]);

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
				isLoading={isLoadingDao || isLoading}
				isGridViewByDefault={false}
				emptyText={'This DAO has no assets'}
			/>
		</div>
	);
};
