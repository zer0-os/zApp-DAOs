import type { FC } from 'react';
import type { zDAO } from '@zero-tech/zdao-sdk';
import type { DAOTableDataItem } from './DaosTable.types';

import React, { useMemo } from 'react';
import { AsyncTable } from '@zero-tech/zui/components';
import { useAllZnas, useAllDaos } from '../../lib/hooks';
import { DaosTableRow } from './DaosTableRow';
import { TABLE_KEYS, TABLE_COLUMNS } from './DaosTable.constants';
import styles from './DaosTable.module.scss';

export const DaosTable: FC = () => {
	const { isLoading: isLoadingZnas, data: znas } = useAllZnas();
	const { isLoading: isLoadingDaos, data: daos } = useAllDaos(znas);

	const isLoading = isLoadingZnas || isLoadingDaos;
	const hasNoDaos = !isLoading && daos.length === 0;

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
			{!hasNoDaos ? (
				<AsyncTable
					data={tableData}
					itemKey={TABLE_KEYS.ZNA}
					columns={TABLE_COLUMNS}
					rowComponent={(daoData) => <DaosTableRow daoData={daoData} />}
					gridComponent={() => <>UNHANDLED</>}
					searchKey={{ key: TABLE_KEYS.ZNA, name: TABLE_KEYS.TITLE }}
					isLoading={isLoading}
				/>
			) : (
				<p className={styles.Empty}>No DAOs here.</p>
			)}
		</div>
	);
};
