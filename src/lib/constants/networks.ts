export enum Network {
	MAINNET = 1,
	RINKEBY = 4,
}

export const DEFAULT_NETWORK = Network.RINKEBY;

export const NETWORK_CONFIGS: {
	[network in Network]: {
		rpcUrl: string;
		ipfsGateway: string;
	};
} = {
	[Network.MAINNET]: {
		rpcUrl: 'https://mainnet.infura.io/v3/77c3d733140f4c12a77699e24cb30c27',
		ipfsGateway: 'snapshot.mypinata.cloud',
	},
	[Network.RINKEBY]: {
		rpcUrl: 'https://rinkeby.infura.io/v3/fa959ead3761429bafa6995a4b25397e',
		ipfsGateway: 'snapshot.mypinata.cloud',
	},
};
