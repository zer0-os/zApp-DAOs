import { useQuery } from 'react-query';
import { useWeb3, useZdaoSdk } from '../';
import { DEFAULT_ZNS_DOMAIN } from 'lib/constants/routes';
import { HARDCODED_PARAMS } from 'lib/constants/daos';

/**
 * Returns a list of all zNA on the current chain
 */
export const useAllZnas = () => {
	const sdk = useZdaoSdk();
	const { chainId } = useWeb3();

	return useQuery(
		['daos', 'znas', { chainId }],
		async () => {
			const znas = (await sdk.listZNAs())?.filter(
				(zna) => zna !== DEFAULT_ZNS_DOMAIN && zna !== 'degen',
			);

			if (chainId === 1) {
				return znas.concat(Object.keys(HARDCODED_PARAMS));
			}

			return znas;
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
		},
	);
};
