import { useQuery } from 'react-query';
import { useDao } from './useDao';
import { AssetType } from '@zero-tech/zdao-sdk';
import { useTotalsStore } from '../../stores/totals';
import { useSafeUrl } from '../state/useSafeUrl';
import { supabase } from 'lib/util/supabase';
import { ethers } from 'ethers';

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

			if (!Number(data[0].fiatBalance ?? 1)) {
				const symbols = data.map((d) => {
					if (!d.token) return 'eth';
					return d.token.symbol;
				});

				const res = await supabase.functions.invoke(
					`get_token_price?symbol=${symbols.join(',')}`,
					{
						method: 'GET',
					},
				);

				const prices = res.data.data;

				data.forEach((d) => {
					const price = prices[d.token?.symbol ?? 'ETH']?.filter((p) => {
						if (!p.platform?.tokenAddress) {
							return true;
						}
						return (
							p.platform.tokenAddress.toLowerCase() ===
							(d.tokenAddress?.toLowerCase() ?? undefined)
						);
					})[0];
					if (price) {
						const balanceAsNumber = Number(
							ethers.utils.formatUnits(d.balance, d.token?.decimals ?? 18),
						);
						const priceInUSD = price.quote['USD'].price;
						d.fiatBalance = balanceAsNumber * priceInUSD;
					}
				});
			}

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

			const amountInUSD = data.reduce(
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(acc: number, item: any) => acc + Number(item.fiatBalance),
				0,
			);

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
