export enum Network {
	MAINNET = 1,
	GOERLI = 5,
}

export const DEFAULT_NETWORK = Network.GOERLI;

export const DEFAULT_IPFS_GATEWAY = 'snapshot.4everland.link';

interface NetworkConfig {
	rpcUrl: string;
	ipfsGateway: string;
}

export const NETWORK_CONFIGS: Record<Network, NetworkConfig> = {
	[Network.MAINNET]: {
		rpcUrl: 'https://mainnet.infura.io/v3/77c3d733140f4c12a77699e24cb30c27',
		ipfsGateway: DEFAULT_IPFS_GATEWAY,
	},
	[Network.GOERLI]: {
		rpcUrl: 'https://goerli.infura.io/v3/77c3d733140f4c12a77699e24cb30c27',
		ipfsGateway: DEFAULT_IPFS_GATEWAY,
	},
};

export const NETWORK_ETHERSCAN: Record<Network, string> = {
	[Network.MAINNET]: '',
	[Network.GOERLI]: '',
};
