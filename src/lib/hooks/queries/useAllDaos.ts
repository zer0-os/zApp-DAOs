import { useQuery } from 'react-query';
import { useAllZnas, useWeb3, useZdaoSdk } from '../';

/**
 * Returns all DAOs on the current chain
 */
export const useAllDaos = () => {
	const sdk = useZdaoSdk();
	const { chainId } = useWeb3();

	const { data: znas, isLoading: isLoadingZnas } = useAllZnas();

	const query = useQuery(
		['daos', { chainId }],
		async () => {
			console.log('getting zDAO for ', znas);
			return await Promise.all(znas.map((zna) => sdk.getZDAOByZNA(zna)));
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: Boolean(znas) && Boolean(znas.length),
		},
	);

	return {
		...query,
		isLoading: isLoadingZnas || query.isLoading,
	};
};
