import React, { FC, useMemo } from 'react';

import type { zDAO } from '@zero-tech/zdao-sdk';

import { useDaoTransactions } from '../../../lib/hooks';
import { DaoTransactionsListItem } from './DaoTransactionsListItem';
import { groupTransactionsByDate, TRANSACTION_GROUP_LABELS } from './lib';

import { LoadingIndicator } from '@zero-tech/zui/components';

import styles from './DaoTransactionsList.module.scss';

/////////////////////////
// DaoTransactionsList //
/////////////////////////

type DaoTransactionsProps = {
	isLoadingDao: boolean;
	dao?: zDAO;
};

export const DaoTransactionsList: FC<DaoTransactionsProps> = ({
	isLoadingDao,
	dao
}) => {
	const { isLoading: isLoadingTransactions, data: transactions } =
		useDaoTransactions(dao);

	const isLoading = isLoadingDao || isLoadingTransactions;

	const groupedTransactions = useMemo(() => {
		if (transactions?.length > 0) {
			return groupTransactionsByDate(transactions);
		}
	}, [transactions]);

	if (isLoading) {
		return (
			<LoadingIndicator
				className={styles.Loading}
				text="Loading transactions"
				spinnerPosition="left"
			/>
		);
	}

	if (!isLoading && !transactions?.length) {
		return <div className={styles.Empty}>This DAO has no transactions.</div>;
	}

	return (
		<div className={styles.Transactions}>
			{Object.entries(groupedTransactions)
				.filter(([, transactions]) => transactions.length > 0)
				.map(([group, transactions]) => (
					<div
						className={styles.TransactionsGroup}
						key={`dao-transactions-group-${group}`}
					>
						<h2 className={styles.TransactionsGroupLabel}>
							{TRANSACTION_GROUP_LABELS[group]}
						</h2>
						<div className={styles.TransactionsGroupItems}>
							{transactions.map((transaction) => (
								<DaoTransactionsListItem
									key={`dao-transaction-${transaction.id}`}
									transaction={transaction}
								/>
							))}
						</div>
					</div>
				))}
		</div>
	);
};
