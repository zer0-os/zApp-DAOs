import { useContext } from 'react';
import { DaosTotalProviderContext } from './DaosTotalProvider';

export const useDaosTotal = () => {
	return useContext(DaosTotalProviderContext);
};
