import React, { FC, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { get } from 'lodash';
import { useDaoProposals, useCurrentDao } from '../../../lib/hooks';
import { sortProposals } from './lib';

import { AsyncTable } from '@zero-tech/zui/components';
import { DaoProposalsTableRow } from './DaoProposalsTableRow';
import { DaoProposalsTableCard } from './DaoProposalsTableCard';

import styles from './DaoProposalsTable.module.scss';
import { zDAO } from '@zero-tech/zdao-sdk';
import { Column } from '@zero-tech/zui/components/AsyncTable';

///////////////////////
// DaoProposalsTable //
///////////////////////

export type DaoProposalsTableProps = {
	isLoadingDao: boolean;
	dao?: zDAO;
};

const TABLE_COLUMNS: Column[] = [
	{ id: 'title', header: 'Title', alignment: 'left' },
	{ id: 'status', header: 'Status', alignment: 'left' },
	{ id: 'closes', header: 'Closes', alignment: 'left' },
	{ id: 'votes', header: 'Votes', alignment: 'right' }
];

export const DaoProposalsTable: FC<DaoProposalsTableProps> = ({
	isLoadingDao,
	dao
}) => {
	const location = useLocation();
	const isGridViewByDefault = get(location.state, 'isGridView', false);

	const { isLoading, proposals } = useProposalsTableData(dao, isLoadingDao);

	return (
		<div className={styles.Container}>
			<AsyncTable
				className={styles.Table}
				data={proposals}
				itemKey={'title'}
				columns={TABLE_COLUMNS}
				rowComponent={(proposal) => (
					<DaoProposalsTableRow
						proposal={proposal}
						key={`dao-proposal-row-${proposal.title}`}
					/>
				)}
				gridComponent={(proposal) => (
					<DaoProposalsTableCard
						proposal={proposal}
						key={`dao-proposal-card-${proposal.title}`}
					/>
				)}
				searchKey={{ key: 'title', name: 'proposal title' }}
				isLoading={isLoading}
				isGridViewByDefault={isGridViewByDefault}
				emptyText={'This DAO has no proposals.'}
			/>
		</div>
	);
};

///////////////////////////
// useProposalsTableData //
///////////////////////////

const useProposalsTableData = (dao, isLoadingDao) => {
	const { isLoading: isLoadingProposals, data: proposalsData } =
		useDaoProposals(dao);
	const { isLoading: isLoadingCurrentDao } = useCurrentDao();

	const proposals = useMemo(
		() => sortProposals(proposalsData),
		[proposalsData]
	);

	return {
		proposals,
		isLoading: isLoadingDao || isLoadingCurrentDao || isLoadingProposals
	};
};
