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
	const { isLoading, assets } = useDaoAssets(dao);

	const tableData: DaoAssetTableDataItem[] = useMemo(() => {
		if (!assets) return [];

		return assets.map(convertAsset);
	}, [assets]);

	const hasNoAssets = !isLoading && assets?.length === 0;

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
				<p className={styles.Empty}>You have no any assets!</p>
			)}
		</div>
	);
};
