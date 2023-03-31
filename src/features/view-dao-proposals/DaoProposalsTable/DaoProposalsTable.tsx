import React, { FC, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { get } from 'lodash';
import { sortProposals } from './lib';
import { useDaoProposals } from '../../../lib/hooks';

import { AsyncTable } from '@zero-tech/zui/components';
import { Column } from '@zero-tech/zui/components/AsyncTable';
import { DaoProposalsTableRow } from './DaoProposalsTableRow';
import { DaoProposalsTableCard } from './DaoProposalsTableCard';

import styles from './DaoProposalsTable.module.scss';

const TABLE_COLUMNS: Column[] = [
	{ id: 'title', header: 'Title', alignment: 'left' },
	{ id: 'status', header: 'Status', alignment: 'left' },
	{ id: 'closes', header: 'Closes', alignment: 'left' },
	{ id: 'votes', header: 'Votes', alignment: 'right' }
];

///////////////////////
// DaoProposalsTable //
///////////////////////

export type DaoProposalsTableProps = {
	zna: string;
};

export const DaoProposalsTable: FC<DaoProposalsTableProps> = ({ zna }) => {
	const location = useLocation();
	const isGridViewByDefault = get(location.state, 'isGridView', false);

	const { isLoading, sortedProposals } = useProposalsTableData(zna);

	return (
		<div className={styles.Container}>
			<AsyncTable
				className={styles.Table}
				data={sortedProposals}
				itemKey={'title'}
				columns={TABLE_COLUMNS}
				rowComponent={(proposal) => (
					<DaoProposalsTableRow
						proposal={proposal}
						key={`dao-proposal-row-${proposal.id}`}
					/>
				)}
				gridComponent={(proposal) => (
					<DaoProposalsTableCard
						proposal={proposal}
						key={`dao-proposal-card-${proposal.id}`}
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

const useProposalsTableData = (zna: string) => {
	const { isLoading: isLoadingProposals, data: proposalsData } =
		useDaoProposals(zna);

	const sortedProposals = useMemo(
		() => sortProposals(proposalsData),
		[proposalsData]
	);

	return {
		sortedProposals,
		isLoading: isLoadingProposals
	};
};
