//- Type Imports
import type { FC } from 'react';

//- React Imports
import React from 'react';

//- Component Imports
import { IconButton } from '../IconButton';
import { IconList, IconGrid } from '../Icons';
import { SearchBar } from './SearchBar';

//- Style Imports
import styles from './Controls.module.scss';

type ControlsProps = {
	placeholder?: string;
	searchInputValue: string;
	onSearchInputValueChange: (value: string) => void;
	isGridView: boolean;
	onChangeView: (isGridView: boolean) => void;
};

export const Controls: FC<ControlsProps> = ({
	placeholder,
	searchInputValue,
	onSearchInputValueChange,
	isGridView,
	onChangeView
}) => (
	<div className={styles.Controls}>
		<div className={styles.SearchBarContainer}>
			<SearchBar
				placeholder={placeholder ?? 'Search'}
				value={searchInputValue}
				onChange={onSearchInputValueChange}
			/>
		</div>
		<div className={styles.IconButtons}>
			<IconButton
				isToggled={!isGridView}
				onClick={() => onChangeView(false)}
				icon={<IconList />}
			/>
			<IconButton
				isToggled={isGridView}
				onClick={() => onChangeView(true)}
				icon={<IconGrid />}
			/>
		</div>
	</div>
);
