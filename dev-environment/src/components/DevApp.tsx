import React from 'react';

import { DaosApp } from '@/index';

import { ethers } from 'ethers';
import { useAccount, useConnect } from 'wagmi';
import { useEthersProvider } from '../lib/useEthersProvider';
import { CHAIN_ID, injectedConnector, RPC_URL } from '../lib/connectors';

import { DevControls } from './DevControls';
import { Redirect, Route, Switch } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const HARDCODED_ZNA = import.meta.env.VITE_DAO_ZNA as string | undefined;

export const DevApp = () => {
	const { address } = useAccount();
	const { connect } = useConnect({
		connector: injectedConnector,
	});

	const provider = useEthersProvider({ chainId: CHAIN_ID });

	return (
		<>
			<DevControls />
			<Switch>
				<Route
					path={HARDCODED_ZNA ? '' : '/:znsRoute/:app'}
					component={() => (
						<DaosApp
							provider={
								provider ?? new ethers.providers.JsonRpcProvider(RPC_URL)
							}
							route={'wilder'}
							web3={{
								chainId: provider?.network?.chainId ?? CHAIN_ID,
								address: address,
								connectWallet: connect,
							}}
						/>
					)}
				/>
				{!HARDCODED_ZNA && (
					<Route>
						<Redirect to={'/0.wilder/daos'} />
					</Route>
				)}
			</Switch>
		</>
	);
};
