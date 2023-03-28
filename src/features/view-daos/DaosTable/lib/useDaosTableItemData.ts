import { useHistory } from 'react-router-dom';

import { useDaoAssetsCoins } from '../../../../lib/hooks';
import { formatFiat } from '../../../../lib/util/format';
import { DOLLAR_SYMBOL } from '../../../../lib/constants/currency';
import { ROUTES } from '../../../../lib/constants/routes';
import type { DAOTableDataItem } from '../';

import DaoIcon from '../../../../assets/default_dao.svg';

//////////////////////////
// useDaosTableItemData //
//////////////////////////

export type DaosTableItemData = {
	imgAlt: string;
	imgSrc: string;
	title: string;
	zna: string;
	totalUsd?: string;
	isLoading: boolean;
	onClick: () => void;
};

export const useDaosTableItemData = (
	daoData: DAOTableDataItem
): DaosTableItemData => {
	const history = useHistory();
	const { isLoading, data: coinsData } = useDaoAssetsCoins(daoData.dao);

	/**
	 * Navigates to the selected DAO zNA
	 */
	const onClick = () => {
		history.push('/0.' + daoData.zna + ROUTES.ZDAOS);
	};

	return {
		imgAlt: daoData.dao.title + ' icon',
		imgSrc: location.origin + DaoIcon,
		title: daoData.dao.title,
		zna: '0://' + daoData.zna,
		totalUsd: !isLoading && DOLLAR_SYMBOL + formatFiat(coinsData?.amountInUSD),
		isLoading,
		onClick
	};
};
