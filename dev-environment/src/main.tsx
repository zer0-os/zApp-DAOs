import './vite-setup';

import React from 'react';
import { render } from 'react-dom';

import { Route, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { createConfig, mainnet, WagmiConfig } from 'wagmi';
import { createPublicClient, http } from 'viem';

import { ThemeEngine } from '@zero-tech/zui/components';
import { Themes } from '@zero-tech/zui/components/ThemeEngine';
import { DevApp } from './components/DevApp';

import './main.css';

const history = createBrowserHistory();

const config = createConfig({
	autoConnect: true,
	publicClient: createPublicClient({
		chain: mainnet,
		transport: http(),
	}),
});

render(
	<React.StrictMode>
		<Router history={history}>
			<WagmiConfig config={config}>
				<ThemeEngine theme={Themes.Dark} />
				<Route path="/:znsRoute/:app" component={DevApp} />
			</WagmiConfig>
		</Router>
	</React.StrictMode>,
	document.getElementById('root'),
);
