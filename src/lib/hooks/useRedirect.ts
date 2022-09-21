import type { LinkProps } from 'react-router-dom';

import { useHistory } from 'react-router-dom';

type UseRedirectReturn = {
	redirect: (to: LinkProps, message?: string) => void;
};

/**
 * Redirects the user to a location, with an optional notification
 * @returns void
 */
export const useRedirect = (): UseRedirectReturn => {
	const { replace } = useHistory();

	const redirect = (to: LinkProps, message?: string) => {
		if (message) {
			// TODO - Implement Toast. If toast is not used hooks, then move to util
			// Use window.alert for now
			alert(message);
		}
		replace(to);
	};

	return {
		redirect
	};
};
