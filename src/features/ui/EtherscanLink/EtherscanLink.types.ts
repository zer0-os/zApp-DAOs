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
};
