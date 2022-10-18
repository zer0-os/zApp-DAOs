// Types import
import type { DAOTableDataItem } from '../DaosTable.types';
import type { DaosTableItemData } from './useDaosTableItemData.types';

// React import
import { useHistory } from 'react-router-dom';

// Hooks import
import { useDaoAssetsCoins } from '../../../lib/hooks';

// Utils import
import { formatFiat } from '../../../lib/util/format';

// Constants import
import { DOLLAR_SYMBOL } from '../../../lib/constants/currency';
import { ZERO_ROOT_SYMBOL } from '../../../lib/constants/networks';
import { ROOT_PATH, ROUTES } from '../../../lib/constants/routes';

// Assets import
import DaoIcon from '../../../assets/default_dao.svg';

export const useDaosTableItemData = (
	daoData: DAOTableDataItem
): DaosTableItemData => {
	const history = useHistory();
	const { isLoading, data: coinsData } = useDaoAssetsCoins(daoData.dao);

	/**
	 * Navigates to the selected DAO zNA
	 */
	const onClick = () => {
		history.push(ROOT_PATH + ROUTES.ZDAOS + '/' + daoData.zna);
	};

	return {
		imgAlt: daoData.dao.title + ' icon',
		imgSrc: location.origin + DaoIcon,
		title: daoData.dao.title,
		zna: ZERO_ROOT_SYMBOL + daoData.zna,
		totalUsd: !isLoading && DOLLAR_SYMBOL + formatFiat(coinsData?.amountInUSD),
		isLoading,
		onClick
	};
};
