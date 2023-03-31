import { useQuery } from 'react-query';
import { useZdaoSdk } from '../sdks';

export const useDao = (zna: string) => {
	const sdk = useZdaoSdk();

	return useQuery(
		['dao', { zna }],
		async () => {
			return await sdk.getZDAOByZNA(zna);
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: zna && zna.trim().length > 0
		}
	);
};
