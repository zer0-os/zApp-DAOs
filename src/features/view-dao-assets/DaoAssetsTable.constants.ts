import type { Column } from '@zero-tech/zui/components/AsyncTable';

export const TABLE_COLUMNS: Column[] = [
	{ id: 'title', header: 'Asset', alignment: 'left' },
	{ id: 'qty', header: 'Quantity', alignment: 'right' },
	{ id: 'amount', header: 'Value (USD)', alignment: 'right' }
];

export const DAO_ASSET_MILIFY_OPTIONS = {
	precision: 5,
	lowercase: false
};
