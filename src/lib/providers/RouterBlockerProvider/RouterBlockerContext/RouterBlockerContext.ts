import type * as contextTypes from './RouterBlockerContext.types';

import { createContext } from 'react';

const INITIAL_STATE: contextTypes.RouterBlockerContext = {
	showDialog: () => undefined,
};

export const RouterBlockerContext =
	createContext<contextTypes.RouterBlockerContext>(INITIAL_STATE);
