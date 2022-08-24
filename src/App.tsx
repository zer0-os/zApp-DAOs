import type { FC } from 'react';

import { Container } from './pages/Container';
import styles from './App.module.scss';

const App: FC = () => {
	return (
		<main className={styles.Main}>
			<Container />
		</main>
	);
};

export default App;
