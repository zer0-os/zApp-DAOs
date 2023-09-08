import { useQuery } from 'react-query';
import { useDao } from './useDao';
import { AssetType } from '@zero-tech/zdao-sdk';

export const useDaoAssetsCoins = (zna?: string) => {
	const { data: dao } = useDao(zna);

	return useQuery(
		['dao', 'assets', 'coins', zna],
		async () => {
			const yep = await fetch(
				`https://safe-transaction-mainnet.safe.global/api/v1/safes/${dao.safeAddress}/balances/usd/?trusted=false&exclude_spam=true`,
			);

			const data = await yep.json();

			const amountInUSD = data.reduce(
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(acc: number, item: any) => acc + Number(item.fiatBalance),
				0,
			);

			const coins = data.map((d) => ({
				type: d.token ? AssetType.ERC20 : AssetType.NATIVE_TOKEN,
				address: d.tokenAddress,
				name: d.token ? d.token.name : 'Ether',
				decimals: d.token ? d.token.decimals : '18',
				symbol: d.token ? d.token.symbol : 'ETH',
				logoUri: d.token ? d.token.logoUri : undefined,
				amount: d.balance,
				amountInUSD: d.fiatBalance,
			}));

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
