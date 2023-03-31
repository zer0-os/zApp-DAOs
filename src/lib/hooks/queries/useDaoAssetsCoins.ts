import { useQuery } from 'react-query';
import { useDao } from './useDao';

export const useDaoAssetsCoins = (zna?: string) => {
	const { data: dao } = useDao(zna);

	return useQuery(
		['dao', 'assets', 'coins', zna],
		async () => {
			return await dao.listAssetsCoins();
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: Boolean(dao)
		}
	);
};
