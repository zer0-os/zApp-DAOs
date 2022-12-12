/**
 * Extracts a zNA from a znsRoute
 * e.g. 0.wilder.wheels => wilder.wheels
 * @param znsRoute from react-router-dom::useRouteMatch
 * @returns zNA from znsRoute, or empty string
 */
export const extractZnaFromZnsRoute = (znsRoute: string): string => {
	return znsRoute.replace(/^0\./, '');
};
