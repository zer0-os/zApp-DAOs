import { useHistory } from 'react-router-dom';

import { useDao, useDaoAssetsCoins } from '../../../lib/hooks';
import { formatFiat } from '../../../lib/util/format';
import { DOLLAR_SYMBOL } from '../../../lib/constants/currency';
import { ROUTES } from '../../../lib/constants/routes';

import DaoIcon from '../../../assets/default_dao.svg';

//////////////////////////
// useDaosTableItemData //
//////////////////////////

export type DaosTableItemData = {
	imgAlt: string;
	imgSrc: string;
	title: string;
	zna: string;
	totalUsd?: string;
	isLoadingAssetData: boolean;
	isLoadingDAOData: boolean;
	onClick: () => void;
};

export const useDAOTableRowData = (zna: string): DaosTableItemData => {
	const history = useHistory();

	const { isLoading: isLoadingDAOData, data: DAOData } = useDao(zna);
	const {
		isLoading: isLoadingAssetData,
		data: coinsData,
		isIdle: isAssetDataIdle,
	} = useDaoAssetsCoins(zna);

	const totalUsd =
		!isLoadingAssetData && coinsData?.amountInUSD
			? DOLLAR_SYMBOL + formatFiat(coinsData?.amountInUSD)
			: undefined;

	/**
	 * Navigates to the selected DAO zNA
	 */
	const onClick = () => {
		history.push('/0.' + zna + ROUTES.ZDAOS + '/assets');
	};

	return {
		imgAlt: DAOData?.title + ' icon',
		imgSrc: location.origin + DaoIcon,
		title: DAOData?.title,
		zna: '0://' + zna,
		totalUsd,
		isLoadingAssetData: isLoadingAssetData || isAssetDataIdle,
		isLoadingDAOData,
		onClick,
	};
};
