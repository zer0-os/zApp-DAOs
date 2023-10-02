import React, { Fragment } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { DaosApp } from '@/*';

import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useEthersProvider } from '../lib/useEthersProvider';
import { CHAIN_ID, RPC_URL } from '../lib/connectors';

const DAO_ZNA = import.meta.env.VITE_DAO_ZNA;
const DAO_ENS = import.meta.env.VITE_DAO_ENS;
const DAO_SAFE_ADDRESS = import.meta.env.VITE_DAO_SAFE_ADDRESS;
const DAO_VOTING_TOKEN = import.meta.env.VITE_DAO_VOTING_TOKEN;
const DAO_NAME = import.meta.env.VITE_DAO_NAME;
const DAO_CREATOR = import.meta.env.VITE_DAO_CREATOR;
const DAO_LOGO_URI = import.meta.env.VITE_DAO_LOGO_URI;

const isUsingHardcodedDao =
	DAO_ZNA &&
	DAO_ENS &&
	DAO_SAFE_ADDRESS &&
	DAO_VOTING_TOKEN &&
	DAO_NAME &&
	DAO_CREATOR;

export const DevApp = () => {
	const { address } = useAccount();
	const { open } = useWeb3Modal();

	const provider = useEthersProvider({ chainId: CHAIN_ID });

	return (
		<Fragment>
			<Switch>
				<Route
					path={isUsingHardcodedDao ? '' : '/:znsRoute/:app'}
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
							dao={
								isUsingHardcodedDao && {
									ens: DAO_ENS,
									zNA: DAO_ZNA,
									title: DAO_NAME,
									creator: DAO_CREATOR,
									network: 1,
									safeAddress: DAO_SAFE_ADDRESS,
									votingToken: DAO_VOTING_TOKEN,
									logoUri: DAO_LOGO_URI,
								}
							}
						/>
					)}
				/>
				{!isUsingHardcodedDao && (
					<Route>
						<Redirect to={'/0.wilder/daos'} />
					</Route>
				)}
			</Switch>
		</Fragment>
	);
};
