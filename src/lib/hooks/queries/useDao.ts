import { useQuery } from 'react-query';
import { useZdaoSdk } from '../sdks';
import { useWeb3 } from '../state';

export const useDao = (zna: string) => {
	const sdk = useZdaoSdk();
	const { chainId } = useWeb3();

	return useQuery(
		['dao', { zna, chainId }],
		async () => {
			return await sdk.getZDAOByZNA(zna);
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: Boolean(zna.trim().length > 0),
		},
	);
};
