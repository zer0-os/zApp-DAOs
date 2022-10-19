import { useQuery } from 'react-query';
import { useWeb3 } from './useWeb3';
import { useZdaoSdk } from './useZdaoSdk';
import { DEFAULT_ZNS_DOMAIN } from '../../lib/constants/routes';

export const useAllZnas = () => {
	const sdk = useZdaoSdk();
	const { chainId } = useWeb3();

	return useQuery(
		['daos-znas-all', chainId],
		async () => {
			const znas = await sdk.listZNAs();

			return znas?.filter((zna) => zna !== DEFAULT_ZNS_DOMAIN);
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false
		}
	);
};
