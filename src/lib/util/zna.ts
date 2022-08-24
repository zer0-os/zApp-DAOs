import { ROOT_PATH } from '../constants/routes';

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
