import { useContext } from 'react';
import { CurrentDaoContext } from '../../providers';

export const useCurrentDao = () => {
	return useContext(CurrentDaoContext);
};
