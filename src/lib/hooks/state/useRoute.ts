import { useRouteMatch } from 'react-router-dom';
import { useDaoStore } from '../../stores/dao';

export const useRoute = () => {
	const { url } = useRouteMatch();
	const daoParams = useDaoStore((state) => state.daoParams);

	return {
		url: daoParams ? url.substring(1) : url,
	};
};
