import { useWeb3 } from './useWeb3';
import { getEtherscanUri } from '../../util/network';

/**
 * Gets etherscan base url for current connected chain
 */
export const useEtherscanUrl = () => {
	const { chainId } = useWeb3();

	return { etherscanUrl: getEtherscanUri(chainId) };
};
