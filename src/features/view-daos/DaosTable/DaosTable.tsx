import React, { FC, useMemo } from 'react';

import type { zDAO } from '@zero-tech/zdao-sdk';
import { useAllZnas, useAllDaos } from '../../../lib/hooks';

import { AsyncTable, Column } from '@zero-tech/zui/components';
import { DaosTableRow } from './DaosTableRow';
import { DaosTableCard } from './DaosTableCard';

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
	{ id: 'amount', header: 'Value (USD)', alignment: 'right' }
];

export type DAOTableDataItem = {
	[TABLE_KEYS.TITLE]: string;
	[TABLE_KEYS.ZNA]: string;
	[TABLE_KEYS.DAO]: zDAO;
};

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
