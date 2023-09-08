import React from 'react';

import { Controls, View, ViewToggle } from '@zero-tech/zui/components';

import styles from './TableControls.module.scss';

interface TableControlsProps {
	view: View;
	onChangeView: (view: View) => void;
}

export const TableControls = ({
	view,
	onChangeView,
}: TableControlsProps): JSX.Element => {
	return (
		<Controls>
			<div data-testid={'zapp-daos-view-toggle'}>
				<ViewToggle
					className={styles.Toggle}
					view={view}
					onChange={onChangeView}
				/>
			</div>
		</Controls>
	);
};
