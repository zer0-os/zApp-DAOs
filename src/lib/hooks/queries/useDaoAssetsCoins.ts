import { useQuery } from 'react-query';
import { useDao } from './useDao';
import { AssetType } from '@zero-tech/zdao-sdk';
import { useTotalsStore } from '../../stores/totals';
import { useSafeUrl } from '../state/useSafeUrl';

export const useDaoAssetsCoins = (zna?: string) => {
	const { data: dao } = useDao(zna);
	const { safeUrl } = useSafeUrl();
	const addDao = useTotalsStore((state) => state.addDao);

	return useQuery(
		['dao', 'assets', 'coins', { zna }],
		async () => {
			const response = await fetch(
				`${safeUrl}/api/v1/safes/${dao.safeAddress}/balances/usd/?trusted=true&exclude_spam=true`,
			);

			const data = await response.json();

			const amountInUSD = data.reduce(
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(acc: number, item: any) => acc + Number(item.fiatBalance),
				0,
			);

			const coins = data.map((d) => {
				const { fiatBalance, balance, tokenAddress, token } = d;

				if (!token) {
					return {
						type: AssetType.NATIVE_TOKEN,
						address: '',
						name: 'Ether',
						decimals: '18',
						symbol: 'ETH',
						logoUri: undefined,
						amount: balance,
						amountInUSD: fiatBalance,
					};
				}

				return {
					type: AssetType.ERC20,
					address: tokenAddress,
					name: token.name === 'ZERO' ? 'MEOW' : token.name,
					decimals: token.decimals,
					symbol: token.symbol === 'ZERO' ? 'MEOW' : token.symbol,
					logoUri: token.logoUri,
					amount: balance,
					amountInUSD: fiatBalance,
				};
			});

			addDao({
				zna,
				totalUsd: amountInUSD,
			});

			return {
				amountInUSD,
				coins,
			};
		},
		{
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: Boolean(dao),
		},
	);
};
