import { HARDCODED_DAO } from './daos';

export const DEFAULT_ZNS_DOMAIN = 'wilder';
export const ROOT_PATH = HARDCODED_DAO ? '/' : `/0.${DEFAULT_ZNS_DOMAIN}`;

export enum ROUTES {
	// ----- zDao ----- //
	ZDAOS = '/daos',
	ZDAO_ASSETS = '/assets',
	ZDAO_TRANSACTIONS = '/transactions',
	ZDAO_PROPOSALS = '/proposals',
}
