import React, { createContext, useMemo, FC } from 'react';

import * as zns from '@zero-tech/zns-sdk';

import { useWeb3 } from '../hooks';
import { DEFAULT_NETWORK, Network } from '../constants/networks';

export const ZnsSdkContext = createContext({} as zns.Instance);

export const ZnsSdkProvider: FC = ({ children }) => {
	const { provider, chainId } = useWeb3();

	const sdk = useMemo(() => {
		/**
		 * Use connected wallet's provider if it exists, otherwise create
		 * a provider using the Infura URL for the selected chain
		 */
		const network: Network = chainId ?? DEFAULT_NETWORK;

		/**
		 * Configure the SDK using provider based on selected network
		 */
		switch (network) {
			case Network.MAINNET: {
				return zns.createInstance(
					zns.configuration.mainnetConfiguration(provider)
				);
			}

			default: {
				throw new Error('SDK isn´t available for this chainId');
			}
		}
	}, [provider, chainId]);

	return (
		<ZnsSdkContext.Provider value={sdk}>{children}</ZnsSdkContext.Provider>
	);
};
