import type { FC } from 'react';

import React from 'react';
import { DAOs } from './pages/DAOs';
import styles from './App.module.scss';

export const App: FC = () => {
	return (
		<main className={styles.Main}>
			<DAOs />
		</main>
	);
};
