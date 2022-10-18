import type { FC } from 'react';
import type { DaoProposalsTableProps } from './DaoProposals.types';

import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { AsyncTable } from '@zero-tech/zui/components';
import { DaoProposalsTableRow } from './DaoProposalsTableRow';
import { DaoProposalsTableCard } from './DaoProposalsTableCard';
import { get } from 'lodash';
import { useDaoProposals, useCurrentDao } from '../../lib/hooks';
import { sortProposals } from './DaoProposals.helpers';
import { TABLE_COLUMNS } from './DaoProposals.constants';
import styles from './DaoProposalsTable.module.scss';

export const DaoProposalsTable: FC<DaoProposalsTableProps> = ({
	isLoadingDao,
	dao
}) => {
	const location = useLocation();
	const { isLoading: isLoadingProposals, data: proposalsData } =
		useDaoProposals(dao);
	const { isLoading: isLoadingCurrentDao } = useCurrentDao();

	const proposals = useMemo(
		() => sortProposals(proposalsData),
		[proposalsData]
	);

	const isLoading = isLoadingDao || isLoadingCurrentDao || isLoadingProposals;
	const isGridViewByDefault = get(location.state, 'isGridView', false);

	return (
		<div className={styles.Container}>
			<AsyncTable
				className={styles.Table}
				data={proposals}
				itemKey={'title'}
				columns={TABLE_COLUMNS}
				rowComponent={(proposal) => (
					<DaoProposalsTableRow proposal={proposal} />
				)}
				gridComponent={(proposal) => (
					<DaoProposalsTableCard proposal={proposal} />
				)}
				searchKey={{ key: 'title', name: 'proposal title' }}
				isLoading={isLoading}
				isGridViewByDefault={isGridViewByDefault}
				emptyText={'This DAO has no proposals.'}
			/>
		</div>
	);
};
