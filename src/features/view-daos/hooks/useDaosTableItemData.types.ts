import type { ReactNode } from 'react';

export type DaosTableItemData = {
	imgAlt: string;
	imgSrc: string;
	title: string;
	zna: string;
	usdValue: ReactNode;
	onClick: () => void;
};
