import { useRouteMatch } from 'react-router-dom';
import { HARDCODED_DAO } from '../../constants/daos';

export const useRoute = () => {
	const { url } = useRouteMatch();

	return {
		url: HARDCODED_DAO ? url.substring(1) : url,
	};
};
