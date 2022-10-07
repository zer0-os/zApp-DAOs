import { useContext } from 'react';
import { CurrentDaoContext } from '../providers/CurrentDaoProvider';

export const useCurrentDao = () => {
	return useContext(CurrentDaoContext);
};
