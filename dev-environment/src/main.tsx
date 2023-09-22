import './vite-setup';

import React from 'react';
import { render } from 'react-dom';

import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { mainnet, WagmiConfig } from 'wagmi';
import { goerli } from 'viem/chains';

import { ThemeEngine } from '@zero-tech/zui/components';
import { Themes } from '@zero-tech/zui/components/ThemeEngine';
import { DevApp } from './components/DevApp';

import './main.css';

const history = createBrowserHistory();

const chains = [mainnet, goerli];

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const projectId = (import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID ??
	process.env.VITE_WALLET_CONNECT_PROJECT_ID) as string | undefined;

const wagmiConfig = defaultWagmiConfig({
	chains,
	projectId,
	appName: 'zApp DAOs',
});

createWeb3Modal({
	wagmiConfig,
	projectId,
	chains,
	themeVariables: {
		'--w3m-accent': 'var(--color-secondary-11)',
		'--w3m-border-radius-master': '1px',
	},
});

render(
	<React.StrictMode>
		<Router history={history}>
			<WagmiConfig config={wagmiConfig}>
				<ThemeEngine theme={Themes.Dark} />
				<DevApp />
			</WagmiConfig>
		</Router>
	</React.StrictMode>,
	document.getElementById('root'),
);
