import type { Token } from '@zero-tech/zdao-sdk';

import { useQuery } from 'react-query';
import { useWeb3 } from './useWeb3';
import { useZnsSdk } from './useZnsSdk';

export const useUserPaymentTokenBalance = (tokenId?: Token['token']) => {
	const znsSdk = useZnsSdk();
	const { account } = useWeb3();

	return useQuery(
		['user-payment-token-balance', account, tokenId],
		async () => {
			return await znsSdk.zauction.getUserBalanceForPaymentToken(
				account,
				tokenId
			);
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: Boolean(account) && Boolean(tokenId)
		}
	);
};
