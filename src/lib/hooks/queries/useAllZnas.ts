import { useQuery } from 'react-query';
import { useWeb3, useZdaoSdk } from '../';
import { DEFAULT_ZNS_DOMAIN } from '../../../lib/constants/routes';

/**
 * Returns a list of all zNA on the current chain
 */
export const useAllZnas = () => {
	const sdk = useZdaoSdk();
	const { chainId } = useWeb3();

	return useQuery(
		['daos', 'znas', { chainId }],
		async () => {
			return (await sdk.listZNAs())?.filter(
				(zna) => zna !== DEFAULT_ZNS_DOMAIN && zna !== 'degen',
			);
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
		},
	);
};
