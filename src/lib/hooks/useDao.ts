import { useQuery } from 'react-query';
import { useZdaoSdk } from './useZdaoSdk';

export const useDao = (zna: string) => {
	const sdk = useZdaoSdk();

	return useQuery(
		['dao-zna', zna],
		async () => {
			return await sdk.getZDAOByZNA(zna);
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: zna.trim().length > 0
		}
	);
};
