import { createContext, useContext } from 'react';
import { createStore, useStore } from 'zustand';
import { DaoParams } from 'lib/types/app';

interface DaoProps {
	daoParams?: DaoParams;
}

interface DaoState extends DaoProps {
	// placeholder
}

type DaoStore = ReturnType<typeof createDaoStore>;

export const createDaoStore = (initProps?: Partial<DaoProps>) => {
	const DEFAULT_PROPS: DaoProps = {
		daoParams: undefined,
	};
	return createStore<DaoState>()(() => ({
		...DEFAULT_PROPS,
		...initProps,
	}));
};

export const DaoContext = createContext<DaoStore | null>(null);

export const useDaoStore = <T>(selector: (state: DaoState) => T): T => {
	const store = useContext(DaoContext);
	return useStore(store, selector);
};
