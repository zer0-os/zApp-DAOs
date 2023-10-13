import { useQuery } from 'react-query';
import { useZdaoSdk } from 'lib/hooks/sdks';
import { useWeb3 } from 'lib/hooks/state';
import { useDaoStore } from 'lib/stores/dao';
import { HARDCODED_PARAMS } from 'lib/constants/daos';

export const useDao = (zna: string) => {
	const sdk = useZdaoSdk();
	const { chainId } = useWeb3();
	const daoParams = useDaoStore((state) => state.daoParams);

	return useQuery(
		['dao', { zna, chainId }],
		async () => {
			if (HARDCODED_PARAMS[zna]) {
				try {
					return await sdk.getZDAOByZNAFromParams(zna);
				} catch (e) {
					return await sdk.createZDAOFromParams(HARDCODED_PARAMS[zna]);
				}
			}

			if (daoParams) {
				try {
					return await sdk.createZDAOFromParams(daoParams);
				} catch (e) {
					return await sdk.getZDAOByZNA(zna);
				}
			}
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
