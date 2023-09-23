import React, { FC, useMemo } from 'react';

import type { Transaction } from '@zero-tech/zdao-sdk';
import { useCurrentDao } from 'lib/hooks';
import { groupTransactionsByDate, TRANSACTION_GROUP_LABELS } from './lib';

import { LoadingIndicator } from '@zero-tech/zui/components';
import { DaoTransactionsListItem } from './components';

import styles from './DaoTransactionsList.module.scss';
import { useInfiniteQuery } from 'react-query';
import { TransactionStatus, TransactionType } from '@zero-tech/zdao-sdk';
import { useSafeUrl } from '../../../lib/hooks/state/useSafeUrl';
import { ScrollTrigger } from '../../ui';

const PAGE_SIZE = 25;

///////////////////////
// Transactions List //
///////////////////////

type DaoTransactionsProps = {
	zna?: string;
};

export const DaoTransactionsList: FC<DaoTransactionsProps> = ({ zna }) => {
	const { safeUrl } = useSafeUrl();
	const { dao, isLoading: isLoadingDao } = useCurrentDao();
	const {
		data,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
		isLoading: isLoadingTransactions,
	} = useInfiniteQuery(
		['dao', 'transactions', { zna }],
		async ({ pageParam = 0 }) => {
			const limit = PAGE_SIZE;
			const offset = pageParam * PAGE_SIZE;
			const url = `${safeUrl}/api/v1/safes/${dao.safeAddress}/all-transactions/?executed=false&queued=true&trusted=true&limit=${limit}&offset=${offset}`;

			const response = await fetch(url);
			const data = await response.json();

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return data.results.map((transaction: any) => ({
				id: transaction.transfers[0].transferId,
				type:
					transaction.from === dao.safeAddress
						? TransactionType.SENT
						: TransactionType.RECEIVED,
				asset: transaction.transfers[0],
				from: transaction.from,
				to: transaction.to,
				created: new Date(transaction.executionDate),
				txHash: transaction.txHash,
				status: TransactionStatus.AWAITING_CONFIRMATIONS,
			}));
		},
		{
			getNextPageParam: (lastPage, pages) => {
				if (lastPage.length === PAGE_SIZE) {
					return pages.length;
				}
			},
			enabled: Boolean(dao) && Boolean(safeUrl),
		},
	);

	const transactions = data?.pages?.flat();
	const isLoading = isLoadingDao || isLoadingTransactions;

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

	return (
		<>
			<TransactionsList transactions={transactions} />
			{hasNextPage && !isFetchingNextPage && (
				<ScrollTrigger onTrigger={fetchNextPage} />
			)}
		</>
	);
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
