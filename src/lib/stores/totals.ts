import { create } from 'zustand';

interface Dao {
	zna: string;
	totalUsd: number;
}

interface TotalsState {
	daos: Dao[];
	addDao: (dao: Dao) => void;
	isLoading: boolean;
}

export const useTotalsStore = create<TotalsState>()((set) => ({
	daos: [],
	addDao: (dao: Dao) =>
		set((state) => {
			const existingDao = state.daos.find((d) => d.zna === dao.zna);
			if (!existingDao) {
				return { daos: [...state.daos, dao] };
			}
		}),
	isLoading: false,
}));
