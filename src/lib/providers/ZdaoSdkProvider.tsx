import React, { createContext, useMemo } from 'react';
import type { FC, ReactNode } from 'react';

import { providers } from 'ethers';
import type { Config } from '@zero-tech/zdao-sdk';
import {
	createSDKInstance,
	productionConfiguration
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

export const ZdaoSdkContext = createContext(
	createSDKInstance(
		productionConfiguration(
			new providers.JsonRpcProvider(NETWORK_CONFIGS[DEFAULT_NETWORK].rpcUrl),
			NETWORK_CONFIGS[DEFAULT_NETWORK].ipfsGateway
		)
	)
);

export const ZdaoSdkProvider: FC<ZdaoSdkProviderProps> = ({ children }) => {
	const { provider, chainId } = useWeb3();

	const sdk = useMemo(() => {
		const network: Network = chainId ?? DEFAULT_NETWORK;

		const config: Config = productionConfiguration(
			provider,
			NETWORK_CONFIGS[network].ipfsGateway
		);

		return createSDKInstance(config);
	}, [provider, chainId]);

	return (
		<ZdaoSdkContext.Provider value={sdk}>{children}</ZdaoSdkContext.Provider>
	);
};
