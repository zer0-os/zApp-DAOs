import type { FC } from 'react';
import type { zDAO } from '@zero-tech/zdao-sdk';
import type { DaoAssetTableDataItem } from './DaoAssetsTable.types';

import React, { useState, useMemo } from 'react';

import { AsyncTable } from '@zero-tech/zui/components';
import { Controls } from '../ui';
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
	const [isGridView, setIsGridView] = useState<boolean>(false);

	const { isLoading, data: assets } = useDaoAssets(dao);

	const tableData: DaoAssetTableDataItem[] = useMemo(() => {
		if (!assets) return [];

		return assets.map(convertAsset);
	}, [assets]);

	const hasNoAssets = !isLoading && assets?.length === 0;

	return (
		<div className={styles.Container}>
			{!hasNoAssets ? (
				<>
					<Controls
						placeholder="Search by name"
						isGridView={isGridView}
						onChangeView={setIsGridView}
					/>
					<AsyncTable
						className={styles.Table}
						data={tableData}
						itemKey={'name'}
						columns={TABLE_COLUMNS}
						rowComponent={(data) => <DaoAssetsTableRow data={data} />}
						gridComponent={(data) => <DaoAssetsTableCard data={data} />}
						searchKey={null}
						isLoading={isLoadingDao || isLoading}
						isGridView={isGridView}
					/>
				</>
			) : (
				<p className={styles.Empty}>This DAO has no assets.</p>
			)}
		</div>
	);
};
