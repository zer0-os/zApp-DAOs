import type { FC } from 'react';
import type { zDAO } from '@zero-tech/zdao-sdk';

import React, { useMemo } from 'react';
import { LoadingIndicator } from '@zero-tech/zui/components';
import { useDaoTransactions } from '../../lib/hooks';
import { DaoTransactionItem } from './DaoTransactionItem';
import { groupTransactionsByDate } from './DaoTransactions.helpers';
import { TRANSACTION_GROUP_LABELS } from './DaoTransactions.constants';
import styles from './DaoTransactions.module.scss';

type DaoTransactionsProps = {
	dao?: zDAO;
};

export const DaoTransactions: FC<DaoTransactionsProps> = ({ dao }) => {
	const { isLoading, data: transactions } = useDaoTransactions(dao);

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
		return <div className={styles.Empty}>No transactions yet</div>;
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
								<DaoTransactionItem
									key={`dao-transaction-${transaction.created}`}
									transaction={transaction}
								/>
							))}
						</div>
					</div>
				))}
		</div>
	);
};
