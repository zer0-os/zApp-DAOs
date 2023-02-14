import type { FC } from 'react';
import type { zDAO } from '@zero-tech/zdao-sdk';
import type { DAOTableDataItem } from './DaosTable.types';

import React, { useMemo } from 'react';
import { AsyncTable } from '@zero-tech/zui/components';
import { useAllZnas, useAllDaos } from '../../lib/hooks';
import { DaosTableRow } from './DaosTableRow';
import { DaosTableCard } from './DaosTableCard';
import { TABLE_KEYS, TABLE_COLUMNS } from './DaosTable.constants';
import styles from './DaosTable.module.scss';

export const DaosTable: FC = () => {
	const { isLoading: isLoadingZnas, data: znas } = useAllZnas();
	const { isLoading: isLoadingDaos, data: daos } = useAllDaos(znas);

	const isLoading = isLoadingZnas || isLoadingDaos;

	const tableData: DAOTableDataItem[] = useMemo(() => {
		if (!znas?.length || !daos?.length || znas?.length !== daos?.length)
			return [];

		return znas.map((zna, index) => {
			const dao: zDAO = daos[index];

			return {
				[TABLE_KEYS.TITLE]: dao.title,
				[TABLE_KEYS.ZNA]: zna,
				[TABLE_KEYS.DAO]: dao
			};
		});
	}, [znas, daos]);

	return (
		<div className={styles.Container}>
			<AsyncTable
				className={styles.Table}
				data={tableData}
				itemKey={TABLE_KEYS.ZNA}
				columns={TABLE_COLUMNS}
				rowComponent={(daoData) => (
					<DaosTableRow
						daoData={daoData}
						key={`dao-table-row-${daoData.zna}`}
					/>
				)}
				gridComponent={(daoData) => (
					<DaosTableCard
						daoData={daoData}
						key={`dao-table-card-${daoData.zna}`}
					/>
				)}
				searchKey={{ key: TABLE_KEYS.ZNA, name: 'ZNA' }}
				isLoading={isLoading}
				isGridViewByDefault={false}
				emptyText={'No DAOs here or the zNA does not exist'}
			/>
		</div>
	);
};
