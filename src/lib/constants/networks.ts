export enum Network {
	MAINNET = 1,
	RINKEBY = 4,
}

export const DEFAULT_NETWORK = Network.RINKEBY;

export const DEFAULT_IPFS_GATEWAY = 'snapshot.mypinata.cloud';

export const NETWORK_CONFIGS: Record<
	Network,
	{
		rpcUrl: string;
		ipfsGateway: string;
	}
> = {
	[Network.MAINNET]: {
		rpcUrl: 'https://mainnet.infura.io/v3/77c3d733140f4c12a77699e24cb30c27',
		ipfsGateway: DEFAULT_IPFS_GATEWAY
	},
	[Network.RINKEBY]: {
		rpcUrl: 'https://rinkeby.infura.io/v3/fa959ead3761429bafa6995a4b25397e',
		ipfsGateway: DEFAULT_IPFS_GATEWAY
	}
};

export const NETWORK_ETHERSCAN: Record<Network, string> = {
	[Network.MAINNET]: '',
	[Network.RINKEBY]: 'rinkeby.'
};

export const ZERO_ROOT_SYMBOL = '0://';
