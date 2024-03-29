import { CreateZDAOParams } from '@zero-tech/zdao-sdk';

enum Chains {
	MainNet = 1,
	Morden = 2,
	Ropsten = 3,
	Rinkeby = 4,
	Goerli = 5,
	Kovan = 42,
	Local = 5777,
}

export interface DaoParams extends CreateZDAOParams {
	logoUri: string;
}

export interface AppProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	provider: any;
	route: string;
	web3: {
		chainId: Chains;
		address: string;
		connectWallet;
	};
	dao?: DaoParams;
}
