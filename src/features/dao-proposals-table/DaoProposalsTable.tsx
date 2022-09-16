import type { FC } from 'react';
import type { zDAO } from '@zero-tech/zdao-sdk';

import React, { useMemo } from 'react';
import { AsyncTable } from '@zero-tech/zui/components';
import { useDaoProposals, useCurrentDao } from '../../lib/hooks';
import { sortProposals } from './DaoProposals.helpers';
import { TABLE_COLUMNS } from './DaoProposals.constants';
import { DaoProposalsTableRow } from './DaoProposalsTableRow';
import styles from './DaoProposalsTable.module.scss';

type DaoProposalsTableProps = {
	isLoadingDao: boolean;
	dao?: zDAO;
};

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
		return <div className={styles.Empty}>No proposals yet</div>;
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
