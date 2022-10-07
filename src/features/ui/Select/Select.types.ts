export type Option = {
	[key: string]: any;
};

export type SelectProps = {
	/**
	 * Label of select
	 */
	label: string;
	/**
	 * Select options
	 */
	options: Option[];
	/**
	 * Selected option
	 */
	selected?: Option;
	/**
	 * Callback for select option
	 */
	onSelect: (selection: Option) => void;
	/**
	 * Error of select
	 */
	error?: boolean;
	/**
	 * Error text of select
	 */
	helperText?: string;
	/**
	 * Custom class name
	 */
	classNames?: {
		container?: string;
		selected?: string;
	};
};
