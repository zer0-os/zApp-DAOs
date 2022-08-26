import type { FC, ReactNode } from 'react';
import type { zDAO } from '@zero-tech/zdao-sdk';

import React, { createContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useDao } from '../hooks';
import { zNAFromPathname } from '../util/zna';

export const CurrentDaoContext = createContext({
	dao: undefined as zDAO | undefined,
	isLoading: true,
	zna: ''
});

type CurrentDaoProviderProps = {
	children?: ReactNode;
};

/**
 * Loads DAO at current zNA
 */
export const CurrentDaoProvider: FC<CurrentDaoProviderProps> = ({
	children
}) => {
	// Get zNA from browser location
	const { pathname } = useLocation();
	const zna = zNAFromPathname(pathname);

	const { isLoading, dao } = useDao(zna);

	const context = {
		dao,
		isLoading,
		zna
	};

	return (
		<CurrentDaoContext.Provider value={context}>
			{children}
		</CurrentDaoContext.Provider>
	);
};
