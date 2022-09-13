import { ROOT_PATH } from '../constants/routes';

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
 * Extracts a zNA from a full pathname
 * e.g. /market/test.name/hello => test.name
 * @param pathname from react-router-dom::useLocation
 * @returns zNA from pathname, or empty string
 */
export const zNAFromPathname = (pathname: string): string => {
	return (
		pathname
			.replace(ROOT_PATH, '')
			.replace(/^\/[a-zA-Z]*\//, '')
			.split('/')[0] ?? ''
	);
};
