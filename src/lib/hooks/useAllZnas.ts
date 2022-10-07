import { useQuery } from 'react-query';
import { useWeb3 } from './useWeb3';
import { useZdaoSdk } from './useZdaoSdk';

export const useAllZnas = () => {
	const sdk = useZdaoSdk();
	const { chainId } = useWeb3();

	return useQuery(
		['daos-znas-all', chainId],
		async () => {
			return await sdk.listZNAs();
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false
		}
	);
};
