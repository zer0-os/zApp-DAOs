import { useQuery } from 'react-query';
import { useDao } from './useDao';
import { AssetType } from '@zero-tech/zdao-sdk';
import { useTotalsStore } from '../../stores/totals';
import { useSafeUrl } from '../state/useSafeUrl';
import { ethers } from 'ethers';

export const useDaoAssetsCoins = (zna?: string) => {
	const { data: dao } = useDao(zna);
	const { safeUrl } = useSafeUrl();
	const addDao = useTotalsStore((state) => state.addDao);

	return useQuery(
		['dao', 'assets', 'coins', { zna }],
		async () => {
			const response = await fetch(
				`${safeUrl}/api/v1/safes/${dao.safeAddress}/balances/?trusted=true&exclude_spam=true`,
			);

			const data = await response.json();

			try {
				const hasFiatBalance = !!data[0]?.fiatBalance;
				if (!hasFiatBalance) {
					const symbols = data.map((d) => {
						if (!d.token) return 'eth';

						// @note: manually remapping ZERO to MEOW since Safe API hasn't updated token symbol
						if (
							d.tokenAddress === '0x0eC78ED49C2D27b315D462d43B5BAB94d2C79bf8'
						) {
							d.token.symbol = 'MEOW';
						}

						return d.token.symbol;
					});

					const symbolsString = symbols.join(',');
					const api = `https://token-price.brett-b26.workers.dev?symbol=${symbolsString}`;

					const res = await fetch(api, {
						method: 'GET',
					});

					if (!res.ok) {
						const error = await res.json();
						throw error;
					}

					const body = await res.json();

					if (!body?.data || body.error) {
						console.error('Failed to retrieved token prices', res);
						throw new Error('Failed to retrieve token prices');
					}

					const prices = body.data;

					data.forEach((d) => {
						const price = prices[d.token?.symbol ?? 'ETH']?.filter((p) => {
							if (!p.platform?.token_address) {
								return true;
							}
							return (
								p.platform.token_address.toLowerCase() ===
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
			} catch (e) {
				console.error('Failed to retrieve token prices', e);
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
