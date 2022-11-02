import React from 'react';
import type { FC } from 'react';

import { ZAppContent } from '@zero-tech/zapp-utils/components/ZAppContent';
import { DAOs } from './pages';

import styles from './App.module.scss';

export const App: FC = () => {
	return (
		<ZAppContent>
			<main className={styles.Main}>
				<DAOs />
			</main>
		</ZAppContent>
	);
};
