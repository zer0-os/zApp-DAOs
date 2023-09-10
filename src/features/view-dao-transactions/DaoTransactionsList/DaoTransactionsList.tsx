import React, { FC, useMemo } from 'react';

import type { Transaction } from '@zero-tech/zdao-sdk';
import { useDaoTransactions } from 'lib/hooks';
import { groupTransactionsByDate, TRANSACTION_GROUP_LABELS } from './lib';

import { LoadingIndicator } from '@zero-tech/zui/components';
import { DaoTransactionsListItem } from './components';

import styles from './DaoTransactionsList.module.scss';

///////////////////////
// Transactions List //
///////////////////////

type DaoTransactionsProps = {
	zna?: string;
};

export const DaoTransactionsList: FC<DaoTransactionsProps> = ({ zna }) => {
	const { isLoading, data: transactions } = useDaoTransactions(zna);

	if (isLoading) {
		return (
			<LoadingIndicator
				className={styles.Loading}
				text="Loading transactions"
				spinnerPosition="left"
			/>
		);
	}

	if (!transactions?.length) {
		return <div className={styles.Empty}>This DAO has no transactions.</div>;
	}

	return <TransactionsList transactions={transactions} />;
};

//////////////////////
// Transaction List //
//////////////////////

interface TransactionsListProps {
	transactions: Transaction[];
}

const TransactionsList = ({ transactions }: TransactionsListProps) => {
	const groupedTransactions = useMemo(() => {
		if (transactions?.length > 0) {
			return groupTransactionsByDate(transactions);
		}
	}, [transactions]);

	return (
		<div className={styles.Transactions}>
			{Object.entries(groupedTransactions)
				.filter(([, transactions]) => transactions.length > 0)
				.map(([group, transactions]) => (
					<TransactionsGroup
						transactions={transactions}
						group={group}
						key={'dao-transactions-group-' + group}
					/>
				))}
		</div>
	);
};

///////////////////////
// Transaction Group //
///////////////////////

interface TransactionsGroupProps {
	group: string;
	transactions: Transaction[];
}

const TransactionsGroup = ({ group, transactions }: TransactionsGroupProps) => {
	return (
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
	);
};
