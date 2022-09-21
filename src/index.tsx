/**
 * This file:
 * - Wraps out App in necessary context providers
 * - Exports the root component
 */

import type { FC } from 'react';
import type { AppProps } from './lib/types/app';

import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ZUIProvider } from '@zero-tech/zui/ZUIProvider';
import { App } from './App';
import { ChainGate } from './lib/util/ChainGate';
import {
	Web3Provider,
	ZdaoSdkProvider,
	ZnsSdkProvider,
	CurrentDaoProvider,
	DaosTotalProvider
} from './lib/providers';

const queryClient = new QueryClient();

export const DaosApp: FC<AppProps> = ({ provider, web3 }) => (
	<QueryClientProvider client={queryClient}>
		<Web3Provider
			provider={provider}
			account={web3.address}
			chainId={web3.chainId}
			connectWallet={web3.connectWallet}
		>
			<ChainGate>
				<ZnsSdkProvider>
					<ZdaoSdkProvider>
						<CurrentDaoProvider>
							<DaosTotalProvider>
								<ZUIProvider>
									<App />
								</ZUIProvider>
							</DaosTotalProvider>
						</CurrentDaoProvider>
					</ZdaoSdkProvider>
				</ZnsSdkProvider>
			</ChainGate>
		</Web3Provider>
	</QueryClientProvider>
);
