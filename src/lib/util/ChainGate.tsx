import type { FC, ReactNode } from 'react';

import React from 'react';
import { Network } from '../constants/networks';
import { useWeb3 } from '../hooks';

interface ChainGateProps {
	children: ReactNode;
}

/**
 * Prevents rendering of children if the connected chain ID
 * is unsupported.
 */
export const ChainGate: FC<ChainGateProps> = ({ children }) => {
	const { chainId } = useWeb3();

	const isSupportedNetwork = Object.values(Network).includes(Number(chainId));

	if (!isSupportedNetwork) {
		return (
			<>
				DAOs is not supported on this chain! Please switch to mainnet or Rinkeby
			</>
		);
	}

	return <>{children}</>;
};
