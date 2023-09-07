import type {
	Transaction,
	ERC721Transfer,
	ERC20Transfer,
} from '@zero-tech/zdao-sdk';

import { AssetType } from '@zero-tech/zdao-sdk';
import { formatWei } from '../../../../lib/util/format';
import { truncateAddress } from '@zero-tech/zui/utils/formatting/addresses';
import {
	TRANSACTION_GROUPS,
	WEEK_IN_MILLISECONDS,
	MONTH_IN_MILLISECONDS,
} from './constants';

export const getTransactionGroup = (
	transaction: Transaction,
): TRANSACTION_GROUPS => {
	const isToday =
		transaction.created.toDateString() === new Date().toDateString();
	const isLastWeek =
		!isToday &&
		transaction.created.getTime() >=
			new Date().getTime() - WEEK_IN_MILLISECONDS; // 604,800,000 = 1 week in milis
	const isLastMonth =
		!isLastWeek &&
		transaction.created.getTime() >=
			new Date().getTime() - MONTH_IN_MILLISECONDS;

	if (isToday) return TRANSACTION_GROUPS.TODAY;
	if (isLastWeek) return TRANSACTION_GROUPS.LAST_WEEK;
	if (isLastMonth) return TRANSACTION_GROUPS.LAST_MONTH;

	return TRANSACTION_GROUPS.EARLIER;
};

export const groupTransactionsByDate = (
	transactions: Transaction[],
): Record<TRANSACTION_GROUPS, Transaction[]> => {
	const groupTransactions = transactions.reduce(
		(groups, transaction) => {
			const tranactionGroup = getTransactionGroup(transaction);
			groups[tranactionGroup].push(transaction);
			return groups;
		},
		{
			[TRANSACTION_GROUPS.TODAY]: [],
			[TRANSACTION_GROUPS.LAST_WEEK]: [],
			[TRANSACTION_GROUPS.LAST_MONTH]: [],
			[TRANSACTION_GROUPS.EARLIER]: [],
		},
	);

	return groupTransactions;
};

export const formatTransactionValue = (transaction: Transaction): string => {
	let transactionValue = '';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const asset = transaction.asset as any;
	const assetType = transaction.asset.type;

	if (asset.value) {
		transactionValue = formatWei(asset.value, asset.decimals ?? 18);

		if (assetType === AssetType.NATIVE_TOKEN) {
			transactionValue += ' ETH';
		} else if (assetType === AssetType.ERC721) {
			const typedAsset = transaction.asset as ERC721Transfer;
			transactionValue =
				(typedAsset.tokenSymbol ??
					typedAsset.tokenName ??
					truncateAddress(typedAsset.tokenAddress)) + ' (NFT)';
		} else if (assetType === AssetType.ERC20) {
			const typedAsset = transaction.asset as ERC20Transfer;
			transactionValue +=
				' ' +
				(typedAsset.tokenSymbol ??
					typedAsset.tokenName ??
					truncateAddress(typedAsset.tokenAddress));
		}
	}

	return transactionValue;
};
