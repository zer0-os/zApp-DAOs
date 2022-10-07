import type { ReactNode } from 'react';

export type RouterBlockerDialogButtonConfig = {
	text?: string;
	onClick?: () => void;
};

export type RouterBlockerDialogConfig = {
	title: ReactNode;
	message: ReactNode;
	confirmButtonConfig?: RouterBlockerDialogButtonConfig;
	cancelButtonConfig?: RouterBlockerDialogButtonConfig;
};

export type RouterBlockerContext = {
	showDialog: ({
		title,
		message,
		confirmButtonConfig,
		cancelButtonConfig
	}: RouterBlockerDialogConfig) => void;
};
