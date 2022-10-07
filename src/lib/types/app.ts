enum Chains {
	MainNet = 1,
	Morden = 2,
	Ropsten = 3,
	Rinkeby = 4,
	Goerli = 5,
	Kovan = 42,
	Local = 5777,
}

export type AppProps = {
	provider: any;
	route: string;
	web3: {
		chainId: Chains;
		address: string;
		connectWallet;
	};
};
