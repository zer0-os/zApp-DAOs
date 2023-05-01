import { useContext } from 'react';
import { Web3Context } from '../../providers';

export const useWeb3 = () => {
	return useContext(Web3Context);
};
