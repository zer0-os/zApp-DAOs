import React, { createContext, FC, ReactNode } from 'react';
import { useRouteMatch } from 'react-router-dom';

import type { zDAO } from '@zero-tech/zdao-sdk';
import { useDao } from 'lib/hooks';
import { extractZnaFromZnsRoute } from 'lib/util/domains';
import { useDaoStore } from 'lib/stores/dao';

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
	const daoParams = useDaoStore((state) => state.daoParams);
	// Get zNA from route match
	const {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		params: { znsRoute },
	} = useRouteMatch();
	const zna = daoParams?.zNA ?? extractZnaFromZnsRoute(znsRoute);

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
