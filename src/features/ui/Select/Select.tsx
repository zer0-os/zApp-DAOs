//- Types Imports
import type { FC } from 'react';
import type { Option, SelectProps } from './Select.types';

//- React Imports
import React, { useState, useRef } from 'react';

// Library Imports
import { useOnClickOutside } from '../../../lib/hooks';

//- Style Imports
import classnames from 'classnames/bind';
import styles from './Select.module.scss';

const cx = classnames.bind(styles);

export const Select: FC<SelectProps> = ({
	options,
	selected,
	onSelect,
	classNames,
	children
}) => {
	//////////////////
	// State & Refs //
	//////////////////

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const wrapperRef = useRef<HTMLDivElement>(null);

	///////////////
	// Functions //
	///////////////

	const handleSelect = (option: Option) => () => {
		onSelect(option);
		handleToggle(false)();
	};

	const handleToggle = (open: boolean) => () => {
		setIsOpen(open);
	};

	/////////////
	// Effects //
	/////////////

	useOnClickOutside(wrapperRef, handleToggle(false));

	return (
		<div
			className={classnames(styles.Dropdown, classNames?.container)}
			ref={wrapperRef}
		>
			<div className={styles.Header} onClick={handleToggle(!isOpen)}>
				{children}
			</div>
			{isOpen && (
				<ul className={styles.Drawer}>
					{options.map((o, index) => (
						<li
							className={cx({
								Selected: selected === o,
								[classNames?.selected]: selected === o
							})}
							onClick={handleSelect(o)}
							key={`select-${index}`}
						>
							{o.title}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
