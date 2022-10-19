import type { FC } from 'react';
import type { Transaction } from '@zero-tech/zdao-sdk';

import React, { useMemo } from 'react';
import classNames from 'classnames/bind';
import { TransactionType } from '@zero-tech/zdao-sdk';
import { Image } from '@zero-tech/zui/components';
import { IconArrowDownLeft } from '@zero-tech/zui/icons';
import { useWeb3 } from '../../lib/hooks';
import { getEtherscanUri } from '../../lib/util/network';
import { EtherscanLink } from '../ui';
import {
	TRANSACTION_IMAGE,
	TRANSACTION_TYPE,
	TRANSACTION_DIRECTION
} from './DaoTransactions.constants';
import { formatTransactionValue } from './DaoTransactions.helpers';
import styles from './DaoTransactions.module.scss';

const cx = classNames.bind(styles);

type DaoTransactionItemProps = {
	transaction: Transaction;
};

export const DaoTransactionItem: FC<DaoTransactionItemProps> = ({
	transaction
}) => {
	const { chainId } = useWeb3();

	const etherscanUri = getEtherscanUri(chainId);

	const transactionValue = useMemo(
		() => formatTransactionValue(transaction),
		[transaction]
	);

	return (
		<div className={styles.TransactionItem}>
			<div className={styles.Details}>
				<span
					className={cx(styles.Icon, {
						Sent: transaction.type === TransactionType.SENT
					})}
				>
					<Image
						alt="transaction icon"
						src={location.origin + TRANSACTION_IMAGE[transaction.asset.type]}
						className={styles.Image}
					/>
					<IconArrowDownLeft className={styles.ArrowIcon} isFilled />
				</span>
				<span className={styles.Type}>
					{TRANSACTION_TYPE[transaction.type]}
				</span>
				<span className={styles.Value}>{transactionValue}</span>
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
				<span className={styles.Date}>
					{transaction.created.toLocaleDateString()}
				</span>
				<span className={styles.Time}>
					{transaction.created.toLocaleTimeString()}
				</span>
			</div>
		</div>
	);
};
