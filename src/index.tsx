/**
 * This file:
 * - Wraps out App in necessary context providers
 * - Exports the root component
 */

import React, { FC, useRef } from 'react';
import type { AppProps } from './lib/types/app';

import { QueryClient, QueryClientProvider } from 'react-query';
import { ZUIProvider } from '@zero-tech/zui/ZUIProvider';
import { App } from './App';
import { ChainGate } from './lib/util/ChainGate';
import {
	Web3Provider,
	ZdaoSdkProvider,
	ZnsSdkProvider,
	RouterBlockerProvider,
	CurrentDaoProvider,
} from './lib/providers';

import { DaosTotalProvider } from './pages/daos/lib/DaosTotalProvider';

import './styles/global.scss';
import { createDaoStore, DaoContext } from './lib/stores/dao';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

export const DaosApp: FC<AppProps> = ({ provider, web3, dao }) => {
	const store = useRef(createDaoStore({ daoParams: dao })).current;

	return (
		<QueryClientProvider client={queryClient}>
			<Web3Provider
				provider={provider}
				account={web3.address}
				chainId={web3.chainId}
				connectWallet={web3.connectWallet}
			>
				<ChainGate>
					<DaoContext.Provider value={store}>
						<ZnsSdkProvider>
							<ZdaoSdkProvider>
								<RouterBlockerProvider>
									<CurrentDaoProvider>
										<DaosTotalProvider>
											<ZUIProvider>
												<App />
											</ZUIProvider>
										</DaosTotalProvider>
									</CurrentDaoProvider>
								</RouterBlockerProvider>
							</ZdaoSdkProvider>
						</ZnsSdkProvider>
					</DaoContext.Provider>
				</ChainGate>
			</Web3Provider>
		</QueryClientProvider>
	);
};
