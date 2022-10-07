import { useContext } from 'react';
import { DaosTotalProviderContext } from '../providers';

export const useDaosTotal = () => {
	return useContext(DaosTotalProviderContext);
};
