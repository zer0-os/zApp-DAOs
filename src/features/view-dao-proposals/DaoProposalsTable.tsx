import type { FC } from 'react';
import type { DaoProposalsTableProps } from './DaoProposals.types';

import React, { useMemo } from 'react';
import { AsyncTable } from '@zero-tech/zui/components';
import { useDaoProposals, useCurrentDao } from '../../lib/hooks';
import { sortProposals } from './DaoProposals.helpers';
import { TABLE_COLUMNS } from './DaoProposals.constants';
import { DaoProposalsTableRow } from './DaoProposalsTableRow';
import styles from './DaoProposalsTable.module.scss';

export const DaoProposalsTable: FC<DaoProposalsTableProps> = ({
	isLoadingDao,
	dao
}) => {
	const { isLoading: isLoadingProposals, data: proposalsData } =
		useDaoProposals(dao);
	const { isLoading: isLoadingCurrentDao } = useCurrentDao();

	const proposals = useMemo(
		() => sortProposals(proposalsData),
		[proposalsData]
	);

	const isLoading = isLoadingDao || isLoadingCurrentDao || isLoadingProposals;
	const noProposals = !isLoading && proposals?.length === 0;

	if (noProposals) {
		return <div className={styles.Empty}>This DAO has no proposals.</div>;
	}

	return (
		<div className={styles.Container}>
			<AsyncTable
				data={proposals}
				itemKey={'title'}
				columns={TABLE_COLUMNS}
				rowComponent={(proposal) => (
					<DaoProposalsTableRow proposal={proposal} />
				)}
				gridComponent={() => <>UNHANDLED</>}
				searchKey={null}
				isLoading={isLoading}
			/>
		</div>
	);
};