import React, { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { DAO_CREATE_PROPOSAL } from '../ViewDAO';
import { ROUTES } from '../../../lib/constants/routes';

import { Button, TabNav, TabsNav } from '@zero-tech/zui/components';

import styles from '../ViewDAO.module.scss';

enum DaoTab {
	Assets = 'Assets',
	Transactions = 'Transactions',
	Proposals = 'Proposals',
}

//////////////
// DAO Tabs //
//////////////

export interface DAOTabsProps {
	showCreateProposalButton?: boolean;
	baseUrl: string;
}

export const DAOTabs = ({
	showCreateProposalButton,
	baseUrl
}: DAOTabsProps) => {
	const history = useHistory();
	const { pathname } = useLocation();

	const tabs: TabNav[] = useMemo(
		() => [
			{
				text: DaoTab.Assets,
				to: baseUrl + ROUTES.ZDAO_ASSETS
			},
			{
				text: DaoTab.Transactions,
				to: baseUrl + ROUTES.ZDAO_TRANSACTIONS
			},
			{
				text: DaoTab.Proposals,
				to: baseUrl + ROUTES.ZDAO_PROPOSALS
			}
		],
		[baseUrl]
	);

	const handleOnPressNewProposal = () => {
		history.push(`${baseUrl + ROUTES.ZDAO_PROPOSALS}/${DAO_CREATE_PROPOSAL}`);
	};

	return (
		<div className={styles.TabsNav}>
			{/* Dao Tabs */}
			<TabsNav tabs={tabs} location={pathname} />

			{/* New Proposal Button */}
			{!showCreateProposalButton && (
				<Button onPress={handleOnPressNewProposal}>New Proposal</Button>
			)}
		</div>
	);
};
