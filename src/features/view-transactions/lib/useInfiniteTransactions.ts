import { useState } from 'react';
import { useInfiniteQuery } from 'react-query';

import { AllTransactionsListResponse } from '@safe-global/api-kit';
import { useSafeUrl } from 'lib/hooks/state/useSafeUrl';
import { useDao, useWeb3 } from 'lib/hooks';
import { getEtherscanUri } from 'lib/util/network';

const PAGE_SIZE = 25;

export const useInfiniteTransactions = (zna: string) => {
	const { safeUrl } = useSafeUrl();
	const { chainId } = useWeb3();
	const etherscanUri = getEtherscanUri(chainId);

	const { data: dao, isLoading: isLoadingDao } = useDao(zna);
	const [currentPage, setCurrentPage] = useState(0);

	const query = useInfiniteQuery(
		['dao', 'transactions', { zna }],
		async ({ pageParam = 0 }) => {
			const limit = PAGE_SIZE;
			const offset = pageParam * PAGE_SIZE;
			const url = `${safeUrl}/api/v1/safes/${dao.safeAddress}/all-transactions/?executed=false&queued=false&trusted=true&limit=${limit}&offset=${offset}`;

			const response = await fetch(url);
			return ((await response.json()) as AllTransactionsListResponse).results;
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

	const allTransfers = query.data?.pages
		.flat()
		.map((t) => t.transfers)
		.flat();
	const visibleTransfers = allTransfers?.slice(
		0,
		(currentPage + 1) * PAGE_SIZE,
	);

	const handleOnMoreTransfers = async () => {
		if (query.isFetchingNextPage || !query.hasNextPage) {
			return;
		}
		if (visibleTransfers.length < allTransfers.length) {
			await new Promise((resolve) => setTimeout(resolve, 500));
			setCurrentPage((prev) => prev + 1);
		} else {
			query.fetchNextPage().then(() => {
				setCurrentPage((prev) => prev + 1);
			});
		}
	};

	return {
		dao,
		etherscanUri,
		handleOnMoreTransfers,
		isLoading: isLoadingDao || query.isLoading,
		visibleTransfers,
		...query,
	};
};
