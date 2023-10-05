import { useQuery } from 'react-query';

import { useCurrentDao, useWeb3, useZnsSdk } from 'lib/hooks';

export const useUserVotePower = () => {
	const { dao } = useCurrentDao();
	const { account } = useWeb3();
	const znsSdk = useZnsSdk();

	return useQuery(
		['dao', 'proposal', 'power', { account, dao: dao?.id }],
		async () => {
			return znsSdk.zauction.getUserBalanceForPaymentToken(
				account,
				dao.votingToken.token,
			);
		},
		{
			enabled: Boolean(account) && Boolean(dao),
		},
	);
};
