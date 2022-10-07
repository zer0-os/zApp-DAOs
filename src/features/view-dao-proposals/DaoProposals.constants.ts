import type { Column } from '@zero-tech/zui/components/AsyncTable';

export enum ProposalClosingStatus {
	NORMAL = 'normal',
	WARNING = 'warning',
	ERROR = 'error',
}

export const TABLE_COLUMNS: Column[] = [
	{ id: 'title', header: 'Title', alignment: 'left' },
	{ id: 'status', header: 'Status', alignment: 'left' },
	{ id: 'closes', header: 'Closes', alignment: 'left' },
	{ id: 'votes', header: 'Votes', alignment: 'right' }
];

export const DEFAULT_TIMER_INTERVAL = 60 * 1000; // milliseconds
export const DEFAULT_TIMER_EXPIRED_LABEL = 'Concluded';

export const PROPOSAL_FILTER_START_DATE = '05/20/2022';

export const PROPOSAL_TITLE_MAX_CHARACTERS = 150;

export const HOUR_IN_MILLISECONDS = 1 * 3600 * 1000;
export const DAY_IN_MILLISECONDS = 24 * 3600 * 1000;
