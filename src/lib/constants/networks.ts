export enum Network {
	MAINNET = 1,
}

export const DEFAULT_NETWORK = Network.MAINNET;

export const DEFAULT_IPFS_GATEWAY = 'snapshot.mypinata.cloud';

interface NetworkConfig {
	rpcUrl: string;
	ipfsGateway: string;
}

export const NETWORK_CONFIGS: Record<Network, NetworkConfig> = {
	[Network.MAINNET]: {
		rpcUrl: 'https://mainnet.infura.io/v3/77c3d733140f4c12a77699e24cb30c27',
		ipfsGateway: DEFAULT_IPFS_GATEWAY
	}
};

export const NETWORK_ETHERSCAN: Record<Network, string> = {
	[Network.MAINNET]: ''
};
