import { useContext } from 'react';
import { ZnsSdkContext } from '../providers';

export const useZnsSdk = () => {
	return useContext(ZnsSdkContext);
};
