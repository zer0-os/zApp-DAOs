import type { Column } from '@zero-tech/zui/components/AsyncTable';

export enum TABLE_KEYS {
	TITLE = 'title',
	ZNA = 'zna',
	DAO = 'dao',
}

export const TABLE_COLUMNS: Column[] = [
	{ id: 'title', header: 'DAO', alignment: 'left' },
	{ id: 'amount', header: 'Value (USD)', alignment: 'right' }
];
