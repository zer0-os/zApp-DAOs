// Truncate wallet address
export const truncateWalletAddress = (
	address: string,
	startingCharacters?: number
) => {
	return `${address.substring(
		0,
		2 + (startingCharacters ?? 0)
	)}...${address.substring(address.length - 4)}`;
};

/**
 * Extracts a zNA from a znsRoute
 * e.g. 0.wilder.wheels => wilder.wheels
 * @param znsRoute from react-router-dom::useRouteMatch
 * @returns zNA from znsRoute, or empty string
 */
export const extractZnaFromZnsRoute = (znsRoute: string): string => {
	return znsRoute.replace(/^0\./, '');
};
