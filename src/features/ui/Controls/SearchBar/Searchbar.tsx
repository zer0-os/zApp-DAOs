//- Type Imports
import type { FC } from 'react';

//- React Imports
import React from 'react';

//- Component Imports
import { IconButton } from '../../IconButton';
import { IconSearch } from '../../Icons';

//- Style Imports
import styles from './SearchBar.module.scss';

type SearchBarProps = {
	placeholder: string;
	value?: string;
	onChange?: (value: string) => void;
};

export const SearchBar: FC<SearchBarProps> = ({
	placeholder,
	value,
	onChange
}) => {
	const onChangeSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value);
	};

	return (
		<div className={styles.Container}>
			<input
				value={value}
				onChange={onChangeSearchValue}
				type="text"
				placeholder={placeholder}
			/>
			<IconButton isTogglable={false} icon={<IconSearch />} />
		</div>
	);
};
