import type { FC, ReactNode } from 'react';
import type { Config } from '@zero-tech/zdao-sdk';

import { createContext, useMemo } from 'react';
import { providers } from 'ethers';
import {
	createSDKInstance,
	developmentConfiguration,
	productionConfiguration,
} from '@zero-tech/zdao-sdk';
import { useWeb3 } from '../hooks';
import {
	DEFAULT_NETWORK,
	Network,
	NETWORK_CONFIGS,
} from '../constants/networks';

type ZdaoSdkProviderProps = {
	children: ReactNode;
};

const defaultConfig =
	DEFAULT_NETWORK === Network.RINKEBY
		? productionConfiguration
		: developmentConfiguration;

export const ZdaoSdkContext = createContext(
	createSDKInstance(
		defaultConfig(
			new providers.JsonRpcProvider(NETWORK_CONFIGS[DEFAULT_NETWORK].rpcUrl),
			NETWORK_CONFIGS[DEFAULT_NETWORK].ipfsGateway,
		),
	),
);

export const ZdaoSdkProvider: FC<ZdaoSdkProviderProps> = ({ children }) => {
	const { provider, chainId } = useWeb3();

	const sdk = useMemo(() => {
		const p =
			provider ??
			new providers.JsonRpcProvider(NETWORK_CONFIGS[DEFAULT_NETWORK].rpcUrl);

		// We know that the chain ID will be a valid network because
		// ChainGate will prevent this provider from rendering if
		// the chain matches an unsupported network
		const network: Network = chainId ?? DEFAULT_NETWORK;

		// Only supporting two networks so can use ternary
		const createConfig =
			network === Network.MAINNET
				? productionConfiguration
				: developmentConfiguration;

		const config: Config = createConfig(
			p,
			NETWORK_CONFIGS[DEFAULT_NETWORK].ipfsGateway,
		);

		const sdk = createSDKInstance(config);

		return sdk;
	}, [provider]);

	return (
		<ZdaoSdkContext.Provider value={sdk}>{children}</ZdaoSdkContext.Provider>
	);
};
