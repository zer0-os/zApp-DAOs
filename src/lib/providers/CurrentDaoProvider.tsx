import type { FC, ReactNode } from 'react';
import type { zDAO } from '@zero-tech/zdao-sdk';

import React, { createContext } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useDao } from 'lib/hooks';
import { extractZnaFromZnsRoute } from 'lib/util/domains';
import { HARDCODED_DAO } from 'lib/constants/daos';

export const CurrentDaoContext = createContext({
	dao: undefined as zDAO | undefined,
	isLoading: true,
	zna: '',
});

type CurrentDaoProviderProps = {
	children?: ReactNode;
};

/**
 * Loads DAO at current zNA
 */
export const CurrentDaoProvider: FC<CurrentDaoProviderProps> = ({
	children,
}) => {
	// Get zNA from route match
	const {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		params: { znsRoute },
	} = useRouteMatch();
	const zna = HARDCODED_DAO ?? extractZnaFromZnsRoute(znsRoute);

	const { isLoading, data: dao } = useDao(zna);

	const context = {
		dao,
		isLoading,
		zna,
	};

	return (
		<CurrentDaoContext.Provider value={context}>
			{children}
		</CurrentDaoContext.Provider>
	);
};
