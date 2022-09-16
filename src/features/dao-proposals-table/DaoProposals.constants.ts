import type { Column } from '@zero-tech/zui/components/AsyncTable';

export const TABLE_COLUMNS: Column[] = [
	{ id: 'title', header: 'Title', alignment: 'left' },
	{ id: 'status', header: 'Status', alignment: 'left' },
	{ id: 'closes', header: 'Closes', alignment: 'left' },
	{ id: 'votes', header: 'Votes', alignment: 'right' }
];

export const PROPOSAL_TABLE_LOCATION_STATE_KEY =
	'PROPOSAL_TABLE_LOCATION_STATE_KEY';

export enum PROPOSAL_TABLE_LOCATION_STATE {
	ROW = 'row',
	CARD = 'card',
}

export const DEFAULT_TIMMER_INTERVAL = 60 * 1000; // mmilliseconds
export const DEFAULT_TIMMER_EXPIRED_LABEL = 'Concluded';

export const PROPOSAL_FILTER_START_DATE = '05/20/2022';

export const PROPOSAL_TITLE_LIMIT = 150;
