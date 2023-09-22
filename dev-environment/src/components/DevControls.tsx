import React from 'react';

import { useAccount } from 'wagmi';
import { truncateAddress } from '@zero-tech/zui/utils';
import { useWeb3Modal } from '@web3modal/wagmi/react';

import { version } from '../../../package.json';

export const DevControls = () => {
	const { address } = useAccount();
	const { open } = useWeb3Modal();

	const content = address ? (
		<span>
			Connected as <b>{truncateAddress(address)}</b>
		</span>
	) : (
		<button onClick={() => open()}>Connect</button>
	);

	return (
		<footer
			style={{
				position: 'fixed',
				bottom: 0,
				width: '100%',
				boxSizing: 'border-box',
				padding: '0.5rem',
				borderRadius: '0.5rem',
				display: 'flex',
				justifyContent: 'space-between',
				height: '2rem',
				alignItems: 'center',
				color: 'black',
				zIndex: 1000,
			}}
			data-testid="zapp-dev-controls"
		>
			<b style={{ background: 'white' }}>zApp DAOs {version}</b>
			<span style={{ background: 'white' }}>{content}</span>
		</footer>
	);
};
