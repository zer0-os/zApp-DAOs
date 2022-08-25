import type { FC } from 'react';

import { DAOs } from './pages/DAOs';
import styles from './App.module.scss';

const App: FC = () => {
	return (
		<main className={styles.Main}>
			<DAOs />
		</main>
	);
};

export default App;
