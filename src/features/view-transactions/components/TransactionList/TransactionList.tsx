import React, { FC, Fragment } from 'react';

import { useInfiniteTransactions } from '../../lib/useInfiniteTransactions';

import { LoadingIndicator } from '@zero-tech/zui/components';
import { ScrollTrigger } from 'features/ui';
import { TransferItem } from './TransferItem';

import styles from './TransactionList.module.scss';

//////////////////////
// Transaction List //
//////////////////////

type TransactionListProps = {
	zna?: string;
};

export const TransactionList: FC<TransactionListProps> = ({ zna }) => {
	const {
		dao,
		etherscanUri,
		handleOnMoreTransfers,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		visibleTransfers,
	} = useInfiniteTransactions(zna);

	if (isLoading) {
		return (
			<LoadingIndicator
				className={styles.Loading}
				text="Loading transactions"
				spinnerPosition="left"
			/>
		);
	}

	if (!visibleTransfers?.length) {
		return <div className={styles.Empty}>This DAO has no transactions.</div>;
	}

	return (
		<Fragment>
			<div className={styles.Transfers}>
				{visibleTransfers?.map((t) => (
					<TransferItem
						transfer={t}
						key={t.tokenId + t.value + t.from + t.transactionHash}
						safeAddress={dao.safeAddress}
						etherscanUri={etherscanUri}
					/>
				))}
			</div>
			{hasNextPage && <ScrollTrigger onTrigger={handleOnMoreTransfers} />}
			{isFetchingNextPage && (
				<LoadingIndicator
					className={styles.Loading}
					text="Loading more transactions"
					spinnerPosition="left"
				/>
			)}
		</Fragment>
	);
};
