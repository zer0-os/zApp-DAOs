import type { FC } from 'react';
import type { DaoProposalsTableProps } from './DaoProposals.types';

import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { AsyncTable } from '@zero-tech/zui/components';
import { Controls } from '../ui';
import { DaoProposalsTableRow } from './DaoProposalsTableRow';
import { DaoProposalsTableCard } from './DaoProposalsTableCard';
import { get } from 'lodash';
import { useDaoProposals, useCurrentDao } from '../../lib/hooks';
import { containsSubstring } from '../../lib/util/string';
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

	const [searchInputValue, setSearchInputValue] = useState<string>('');
	const [isGridView, setIsGridView] = useState<boolean>(
		get(location.state, 'isGridView', false)
	);

	const proposals = useMemo(() => {
		const proposals = sortProposals(proposalsData);

		if (searchInputValue) {
			return proposals.filter((p) =>
				containsSubstring(p.title, searchInputValue)
			);
		}

		return proposals;
	}, [proposalsData, searchInputValue]);

	const isLoading = isLoadingDao || isLoadingCurrentDao || isLoadingProposals;
	const noProposals =
		!isLoading && !searchInputValue && proposals?.length === 0;

	if (noProposals) {
		return <div className={styles.Empty}>This DAO has no proposals.</div>;
	}

	return (
		<div className={styles.Container}>
			<Controls
				placeholder="Search by proposal title"
				searchInputValue={searchInputValue}
				onSearchInputValueChange={setSearchInputValue}
				isGridView={isGridView}
				onChangeView={setIsGridView}
			/>
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
				searchKey={null}
				isLoading={isLoading}
				isGridView={isGridView}
			/>
		</div>
	);
};
