import type { FC } from 'react';
import type { zDAO } from '@zero-tech/zdao-sdk';
import type { DAOTableDataItem } from './DaosTable.types';

import React, { useState, useMemo } from 'react';
import { AsyncTable } from '@zero-tech/zui/components';
import { useAllZnas, useAllDaos } from '../../lib/hooks';
import { containsSubstring } from '../../lib/util/string';
import { Controls } from '../ui';
import { DaosTableRow } from './DaosTableRow';
import { DaosTableCard } from './DaosTableCard';
import { TABLE_KEYS, TABLE_COLUMNS } from './DaosTable.constants';
import styles from './DaosTable.module.scss';

export const DaosTable: FC = () => {
	const [searchInputValue, setSearchInputValue] = useState<string>('');
	const [isGridView, setIsGridView] = useState<boolean>(false);

	const { isLoading: isLoadingZnas, data: znas } = useAllZnas();
	const { isLoading: isLoadingDaos, data: daos } = useAllDaos(znas);

	const isLoading = isLoadingZnas || isLoadingDaos;
	const hasNoDaos = !isLoading && daos.length === 0;

	const tableData: DAOTableDataItem[] = useMemo(() => {
		if (!znas?.length || !daos?.length || znas?.length !== daos?.length)
			return [];

		const tableDataItems = znas.map((zna, index) => {
			const dao: zDAO = daos[index];

			return {
				[TABLE_KEYS.TITLE]: dao.title,
				[TABLE_KEYS.ZNA]: zna,
				[TABLE_KEYS.DAO]: dao
			};
		});

		if (searchInputValue) {
			return tableDataItems.filter(
				(dataItem) =>
					containsSubstring(dataItem[TABLE_KEYS.TITLE], searchInputValue) ||
					containsSubstring(dataItem[TABLE_KEYS.ZNA], searchInputValue)
			);
		}

		return tableDataItems;
	}, [znas, daos, searchInputValue]);

	return (
		<div className={styles.Container}>
			{!hasNoDaos ? (
				<>
					<Controls
						placeholder="Search by ZNA"
						searchInputValue={searchInputValue}
						onSearchInputValueChange={setSearchInputValue}
						isGridView={isGridView}
						onChangeView={setIsGridView}
					/>
					<AsyncTable
						className={styles.Table}
						data={tableData}
						itemKey={TABLE_KEYS.ZNA}
						columns={TABLE_COLUMNS}
						rowComponent={(daoData) => <DaosTableRow daoData={daoData} />}
						gridComponent={(daoData) => <DaosTableCard daoData={daoData} />}
						searchKey={{ key: TABLE_KEYS.ZNA, name: TABLE_KEYS.TITLE }}
						isLoading={isLoading}
						isGridView={isGridView}
					/>
				</>
			) : (
				<p className={styles.Empty}>No DAOs here.</p>
			)}
		</div>
	);
};
