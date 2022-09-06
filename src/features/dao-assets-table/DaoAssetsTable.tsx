import type { FC } from 'react';
import type { zDAO } from '@zero-tech/zdao-sdk';
import type { DaoAssetTableDataItem } from './DaoAssetsTable.types';

import React, { useMemo } from 'react';
import { AsyncTable } from '@zero-tech/zui/components';
import { useDaoAssets } from '../../lib/hooks';
import { TABLE_COLUMNS } from './DaoAssetsTable.constants';
import { convertAsset } from './DaoAssetsTable.helpers';
import { DaoAssetsTableRow } from './DaoAssetsTableRow';
import styles from './DaoAssetsTable.module.scss';

type DaoAssetsTableProps = {
	isLoadingDao: boolean;
	dao?: zDAO;
};

export const DaoAssetsTable: FC<DaoAssetsTableProps> = ({
	isLoadingDao,
	dao
}) => {
	const { isLoading, data: assetsData } = useDaoAssets(dao);

	const tableData: DaoAssetTableDataItem[] = useMemo(() => {
		if (!assetsData?.assets) return [];

		return assetsData.assets.map(convertAsset);
	}, [assetsData]);

	const hasNoAssets = !isLoading && assetsData?.assets?.length === 0;

	return (
		<div className={styles.Container}>
			{!hasNoAssets ? (
				<AsyncTable
					data={tableData}
					itemKey={'name'}
					columns={TABLE_COLUMNS}
					rowComponent={(data) => <DaoAssetsTableRow data={data} />}
					gridComponent={() => <>UNHANDLED</>}
					searchKey={null}
					isLoading={isLoadingDao || isLoading}
				/>
			) : (
				<p className={styles.Empty}>This DAO has no assets.</p>
			)}
		</div>
	);
};
