import type { RouterBlockerDialogConfig } from '../providers/RouterBlockerProvider/RouterBlockerContext/RouterBlockerContext.types';

import { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { RouterBlockerContext } from '../providers/RouterBlockerProvider/RouterBlockerContext';

export function useRouteChangeDialog(
	config: RouterBlockerDialogConfig,
	isDisabled = true
) {
	const history = useHistory();

	const { showDialog } = useContext(RouterBlockerContext);

	const blocker = () => {
		const unblock = history.block(({ pathname }) => {
			if (isDisabled) {
				if (!config.confirmButtonConfig?.onClick) {
					config.confirmButtonConfig = {
						...config?.confirmButtonConfig,
						onClick: () => {
							// we can now unblock
							unblock();
							// proceed with the blocked navigation
							history.push(pathname);
						}
					};
				}

				showDialog(config);

				return false;
			}

			return true;
		});

		// just in case theres an unmount we can unblock if it exists
		return unblock;
	};

	useEffect(
		blocker,
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[history, isDisabled]
	);
}
