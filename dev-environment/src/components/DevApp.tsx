import React from 'react';

import { DaosApp } from '@/index';

import { ethers } from 'ethers';
import { useAccount, useConnect } from 'wagmi';
import { useEthersProvider } from '../lib/useEthersProvider';
import { injectedConnector } from '../lib/connectors';

import { DevControls } from './DevControls';
import { Route } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const RPC_URL = import.meta.env.VITE_RPC_URL_1 ?? process.env.RPC_URL;

export const DevApp = () => {
	const { address } = useAccount();
	const { connect } = useConnect({
		connector: injectedConnector,
	});

	const provider = useEthersProvider({ chainId: 1 });

	return (
		<>
			<DevControls />
			<Route
				path="/:znsRoute/:app"
				component={() => (
					<DaosApp
						provider={provider ?? new ethers.providers.JsonRpcProvider(RPC_URL)}
						route={'wilder'}
						web3={{
							chainId: provider?.network.chainId ?? 1,
							address: address,
							connectWallet: connect,
						}}
					/>
				)}
			/>
		</>
	);
};
