import React, { createContext, useMemo } from 'react';
import type { FC, ReactNode } from 'react';

// import { providers } from 'ethers';
import {
	createSDKInstance,
	productionConfiguration,
	developmentConfiguration,
	SDKInstance
} from '@zero-tech/zdao-sdk';

import { useWeb3 } from '../hooks';
import {
	DEFAULT_NETWORK,
	Network,
	NETWORK_CONFIGS
} from '../constants/networks';

type ZdaoSdkProviderProps = {
	children: ReactNode;
};

export const ZdaoSdkContext = createContext<SDKInstance>(null);

export const ZdaoSdkProvider: FC<ZdaoSdkProviderProps> = ({ children }) => {
	const { provider, chainId } = useWeb3();

	const sdk = useMemo(() => {
		const network: Network = chainId ?? DEFAULT_NETWORK;

		switch (network) {
			case Network.MAINNET: {
				return createSDKInstance(
					productionConfiguration(
						provider,
						NETWORK_CONFIGS[network].ipfsGateway
					)
				);
			}

			case Network.GOERLI: {
				return createSDKInstance(
					developmentConfiguration(
						provider,
						NETWORK_CONFIGS[network].ipfsGateway
					)
				);
			}

			default: {
				throw new Error('unsupported chainId');
			}
		}
	}, [provider, chainId]);

	return (
		<ZdaoSdkContext.Provider value={sdk}>{children}</ZdaoSdkContext.Provider>
	);
};
