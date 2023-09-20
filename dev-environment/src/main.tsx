import './vite-setup';

import React from 'react';
import { render } from 'react-dom';

import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { configureChains, createConfig, mainnet, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

import { ThemeEngine } from '@zero-tech/zui/components';
import { Themes } from '@zero-tech/zui/components/ThemeEngine';
import { DevApp } from './components/DevApp';

import './main.css';
import { goerli } from 'viem/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';

const history = createBrowserHistory();

const { chains, publicClient } = configureChains(
	[mainnet, goerli],
	[publicProvider()],
);

const config = createConfig({
	autoConnect: true,
	connectors: [new InjectedConnector({ chains })],
	publicClient,
});

render(
	<React.StrictMode>
		<Router history={history}>
			<WagmiConfig config={config}>
				<ThemeEngine theme={Themes.Dark} />
				<DevApp />
			</WagmiConfig>
		</Router>
	</React.StrictMode>,
	document.getElementById('root'),
);
