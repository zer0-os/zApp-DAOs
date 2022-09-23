export type Option = {
	[key: string]: any;
};

export type SelectProps = {
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
	 * Custom class name
	 */
	classNames?: {
		container?: string;
		selected?: string;
	};
};
