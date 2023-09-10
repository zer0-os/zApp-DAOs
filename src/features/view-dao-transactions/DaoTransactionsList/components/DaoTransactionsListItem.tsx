import React, { FC, useMemo } from 'react';

import { Transaction, TransactionType } from '@zero-tech/zdao-sdk';
import { useWeb3 } from 'lib/hooks';
import { getEtherscanUri } from 'lib/util/network';
import { EtherscanLink } from 'features/ui';
import {
	formatTransactionValue,
	TRANSACTION_TYPE,
	TRANSACTION_DIRECTION,
} from '../lib';

import { IconArrowDownLeft } from '@zero-tech/zui/icons';

import styles from './DaoTransactionsListItem.module.scss';

/////////////////////////////
// DaoTransactionsListItem //
/////////////////////////////

type DaoTransactionItemProps = {
	transaction: Transaction;
};

export const DaoTransactionsListItem: FC<DaoTransactionItemProps> = ({
	transaction,
}) => {
	const { chainId } = useWeb3();

	const etherscanUri = getEtherscanUri(chainId);

	const transactionValue = useMemo(
		() => formatTransactionValue(transaction),
		[transaction],
	);

	return (
		<div className={styles.TransactionItem}>
			<div className={styles.Details}>
				<span
					className={styles.Icon}
					data-type={
						transaction.type === TransactionType.SENT ? 'sent' : 'received'
					}
				>
					{/*<Image*/}
					{/*	alt="transaction icon"*/}
					{/*	src={location.origin + TRANSACTION_IMAGE[transaction.asset.type]}*/}
					{/*	className={styles.Image}*/}
					{/*/>*/}
					<IconArrowDownLeft className={styles.ArrowIcon} isFilled />
				</span>
				<div className={styles.OuterTextWrapper}>
					<div className={styles.InnerTextWrapper}>
						<span className={styles.Type}>
							{TRANSACTION_TYPE[transaction.type]}
						</span>
						<EtherscanLink
							className={styles.EtherscanLink}
							etherscanUri={etherscanUri}
							address={transaction.txHash}
							type={'tx'}
							label={transactionValue}
						/>
						<span className={styles.Direction}>
							{TRANSACTION_DIRECTION[transaction.type]}
						</span>
						<EtherscanLink
							className={styles.EtherscanLink}
							etherscanUri={etherscanUri}
							address={transaction.to}
							truncatingStartCharactersCount={0}
						/>
					</div>
					<div className={styles.DateTime}>
						<span>{transaction.created.toLocaleDateString()}</span>
						<span>{transaction.created.toLocaleTimeString()}</span>
					</div>
				</div>
			</div>
		</div>
	);
};
