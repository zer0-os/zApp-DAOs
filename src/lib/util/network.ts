import { Network, NETWORK_ETHERSCAN } from '../constants/networks';

export const getEtherscanUri = (network: Network): string => {
	return `https://${NETWORK_ETHERSCAN[network]}etherscan.io/`;
};
