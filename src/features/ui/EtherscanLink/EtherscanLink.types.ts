export type EtherscanLinkProps = {
	/**
	 * EtherscanUri of network
	 */
	etherscanUri: string;
	/**
	 * Wallet address
	 */
	address?: string;
	/**
	 * Enables truncated or not
	 */
	shouldTruncated?: boolean;
	/**
	 * Truncating start characters count
	 */
	truncatingStartCharactersCount?: number;
	/**
	 * Custon class name
	 */
	className?: string;
	/**
	 * Etherscan link type: can be address or tx
	 */
	type?: 'address' | 'tx';

	/**
	 * label to be displayed if it is of type tx
	 */
	label?: string;
};
