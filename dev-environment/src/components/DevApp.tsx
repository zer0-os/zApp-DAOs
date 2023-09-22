import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { DaosApp } from '@/*';

import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useEthersProvider } from '../lib/useEthersProvider';
import { CHAIN_ID, RPC_URL } from '../lib/connectors';

import { DevControls } from './DevControls';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const HARDCODED_ZNA = import.meta.env.VITE_DAO_ZNA as string | undefined;

export const DevApp = () => {
	const { address } = useAccount();
	const { open } = useWeb3Modal();

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
								connectWallet: open,
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
