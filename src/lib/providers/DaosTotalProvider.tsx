import type { FC } from 'react';
import type { zDAO, zNA } from '@zero-tech/zdao-sdk';

import React, { useState, useMemo, useEffect, createContext } from 'react';
import { useAllZnas, useAllDaos, useDaoAssetsCoins } from '../hooks';

type Total = {
	total: number;
	isLoading: boolean;
};

type Totals = {
	[key: zNA]: Total;
};

type DaoWithZna = {
	dao: zDAO;
	zna: zNA;
};

/**
 * Get Dao Total Price
 * Call "useDaoAssetsCoins" hooks by behaving as a functional component,
 * but it does not render anything
 */
const GetDaoTotals = ({
	dao,
	zna,
	onSetDaoTotal
}: {
	dao: zDAO;
	zna: zNA;
	onSetDaoTotal: (zna: zNA, value: Total) => void;
}) => {
	const { isLoading, data: coinsData } = useDaoAssetsCoins(dao);

	useEffect(() => {
		onSetDaoTotal(zna, {
			isLoading,
			total: coinsData?.amountInUSD ?? 0
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading, coinsData?.amountInUSD]);

	return null;
};

/**
 * Context Definition
 */
export const DaosTotalProviderContext = createContext({
	isLoading: false,
	total: 0
});

/**
 * Provider Definition
 */
export const DaosTotalProvider: FC = ({ children }) => {
	const [totals, setTotals] = useState<Totals>({});

	const { isLoading: isLoadingZnas, data: znas } = useAllZnas();
	const { isLoading: isLoadingDaos, data: daos } = useAllDaos(znas);

	const onSetDaoTotal = (zna: zNA, total: Total) => {
		setTotals((totals) => ({
			...totals,
			[zna]: total
		}));
	};

	const daoWithZnas: DaoWithZna[] = useMemo(() => {
		if (!znas?.length || !daos?.length || znas?.length !== daos?.length) {
			return [];
		}

		return znas.map((zna, index) => {
			const dao: zDAO = daos[index];

			return {
				dao,
				zna
			};
		});
	}, [znas, daos]);

	const contextValue = useMemo(() => {
		const allTotals: Total[] = Object.values(totals);
		const isTotalsLoading =
			allTotals.filter((total: Total) => total.isLoading)?.length > 0;
		const total = allTotals.reduce((a, b) => a + b.total, 0);

		return {
			isLoading: isLoadingZnas || isLoadingDaos || isTotalsLoading,
			total
		};
	}, [isLoadingZnas, isLoadingDaos, totals]);

	return (
		<DaosTotalProviderContext.Provider value={contextValue}>
			{daoWithZnas?.map((daoWithZna: DaoWithZna) => (
				<GetDaoTotals
					key={`dao-totals-${daoWithZna.zna}`}
					dao={daoWithZna.dao}
					zna={daoWithZna.zna}
					onSetDaoTotal={onSetDaoTotal}
				/>
			))}
			{children}
		</DaosTotalProviderContext.Provider>
	);
};
