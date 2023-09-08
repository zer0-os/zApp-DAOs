import { useQuery } from 'react-query';
import { useDao } from './useDao';
import { TransactionStatus, TransactionType } from '@zero-tech/zdao-sdk';

export const useDaoTransactions = (zna?: string) => {
	const { data: dao, isLoading } = useDao(zna);

	const query = useQuery(
		['dao', 'transactions', { zna }],
		async () => {
			const response = await fetch(
				`https://safe-transaction-mainnet.safe.global/api/v1/safes/${dao.safeAddress}/all-transactions/?executed=false&queued=true&trusted=true`,
			);

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
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: Boolean(dao) && Boolean(zna),
		},
	);

	return {
		...query,
		isLoading: isLoading || query.isLoading,
	};
};
