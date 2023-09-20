import { useWeb3 } from './useWeb3';
import { Network } from 'lib/constants/networks';

export const SAFE_URL: Record<Network, string> = {
	[Network.MAINNET]: 'https://safe-transaction-mainnet.safe.global',
	[Network.GOERLI]: 'https://safe-transaction-goerli.safe.global',
};

export const useSafeUrl = () => {
	const { chainId } = useWeb3();

	return { safeUrl: SAFE_URL[chainId] };
};
