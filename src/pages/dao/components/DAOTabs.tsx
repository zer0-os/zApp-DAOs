import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { ROUTES } from 'lib/constants/routes';

import { TabNav, TabsNav } from '@zero-tech/zui/components';

import styles from './Page.module.scss';

enum DaoTab {
	Assets = 'Assets',
	Transactions = 'Transactions',
	Proposals = 'Proposals',
}

//////////////
// DAO Tabs //
//////////////

export interface DAOTabsProps {
	baseUrl: string;
}

export const DAOTabs = ({ baseUrl }: DAOTabsProps) => {
	const { pathname } = useLocation();

	const tabs: TabNav[] = useMemo(
		() => [
			{
				text: DaoTab.Assets,
				to: baseUrl + ROUTES.ZDAO_ASSETS,
			},
			{
				text: DaoTab.Transactions,
				to: baseUrl + ROUTES.ZDAO_TRANSACTIONS,
			},
			// {
			// 	text: DaoTab.Proposals,
			// 	to: baseUrl + ROUTES.ZDAO_PROPOSALS,
			// },
		],
		[baseUrl],
	);

	// Remove trailing slash from URL
	const location = pathname.replace(/\/$/, '');

	return (
		<div className={styles.TabsNav}>
			<TabsNav tabs={tabs} location={location} />
		</div>
	);
};
