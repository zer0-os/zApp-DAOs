//- Types Imports
import type { FC } from 'react';
import type { Option, SelectProps } from './Select.types';

//- React Imports
import React, { useState, useRef } from 'react';

// Component Imports
import { Input } from '@zero-tech/zui/components';
import { IconChevronDown } from '../../ui';

// Library Imports
import { useOnClickOutside } from '../../../lib/hooks';

//- Style Imports
import classnames from 'classnames/bind';
import styles from './Select.module.scss';

const cx = classnames.bind(styles);

export const Select: FC<SelectProps> = ({
	label,
	options,
	selected,
	onSelect,
	classNames,
	error,
	helperText
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
				<Input
					label={label}
					value={selected?.title}
					onChange={null}
					error={error}
					helperText={helperText}
				/>
				<IconChevronDown />
			</div>
			{isOpen && (
				<div className={styles.Drawer}>
					<ul>
						{options.map((o, index) => (
							<li
								className={cx({
									[classNames?.selected]: selected.value === o.value
								})}
								onClick={handleSelect(o)}
								key={`select-${index}`}
							>
								{o.title}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};
