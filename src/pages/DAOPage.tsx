import type { FC } from 'react';

import React from 'react';
import { ROOT_PATH, ROUTES } from '../lib/constants/routes';
import { BackLinkButton } from '../features/ui';

export const DAOPage: FC = () => {
	return (
		<>
			<BackLinkButton label="All DAOs" to={ROOT_PATH + ROUTES.ZDAOS} />
			<p>DAO - Detail Page</p>
		</>
	);
};
