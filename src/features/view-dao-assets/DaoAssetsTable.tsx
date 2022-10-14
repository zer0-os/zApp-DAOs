import type { FC } from 'react';
import type { zDAO } from '@zero-tech/zdao-sdk';
import type { DaoAssetTableDataItem } from './DaoAssetsTable.types';

import React, { useState, useMemo } from 'react';

import { AsyncTable } from '@zero-tech/zui/components';
import { Controls } from '../ui';
import { DaoAssetsTableRow } from './DaoAssetsTableRow';
import { DaoAssetsTableCard } from './DaoAssetsTableCard';

import { useDaoAssets } from '../../lib/hooks';
import { containsSubstring } from '../../lib/util/string';
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
	const [searchInputValue, setSearchInputValue] = useState<string>('');
	const [isGridView, setIsGridView] = useState<boolean>(false);

	const { isLoading, data: assetsData } = useDaoAssets(dao);

	const tableData: DaoAssetTableDataItem[] = useMemo(() => {
		if (!assetsData?.assets) return [];

		const tableDataItems = assetsData.assets.map(convertAsset);

		if (searchInputValue) {
			return tableDataItems.filter(
				(dataItem) =>
					containsSubstring(dataItem.name, searchInputValue) ||
					containsSubstring(dataItem.subtext, searchInputValue)
			);
		}

		return tableDataItems;
	}, [assetsData, searchInputValue]);

	const hasNoAssets = !isLoading && assetsData?.assets?.length === 0;

	return (
		<div className={styles.Container}>
			{!hasNoAssets ? (
				<>
					<Controls
						placeholder="Search by name"
						searchInputValue={searchInputValue}
						onSearchInputValueChange={setSearchInputValue}
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
