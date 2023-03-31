import { useContext } from 'react';
import { ZdaoSdkContext } from '../../providers';

export const useZdaoSdk = () => {
	return useContext(ZdaoSdkContext);
};
