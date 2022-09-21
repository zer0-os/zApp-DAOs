import type { FC } from 'react';
import type { zDAO } from '@zero-tech/zdao-sdk';

import React, { useLayoutEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { LoadingIndicator } from '@zero-tech/zui/components';
import { DAO_CREATE_PROPOSAL } from '../../../pages/DAO/DAO.constants';
import { BackLinkButton } from '../../ui';
import styles from './CreateProposal.module.scss';

type CreateProposalProps = {
	isLoadingDao: boolean;
	dao?: zDAO;
};

export const CreateProposal: FC<CreateProposalProps> = ({
	isLoadingDao,
	dao
}) => {
	// Hooks
	const history = useHistory();

	// Data
	const toAllProposals = history.location.pathname.replace(
		`/${DAO_CREATE_PROPOSAL}`,
		''
	);

	// Life cycle
	useLayoutEffect(() => {
		const nav = document.getElementById('dao-page-nav-tabs');

		nav.style.display = 'none';

		return () => {
			nav.style.display = 'block';
		};
	}, []);

	// Render
	return (
		<div className={styles.Container}>
			{/* Back to All Proposals */}
			<BackLinkButton label="All Proposals" to={toAllProposals} />

			{/* Content */}
			<div className={styles.Content}>
				{isLoadingDao && (
					<LoadingIndicator
						className={styles.Loading}
						text="Loading dao"
						spinnerPosition="left"
					/>
				)}

				{!isLoadingDao && (
					<div className={styles.Wrapper}>
						{/* Title */}
						<h1 className={styles.Title}>Create a Proposal</h1>
						{/* Form */}
						Proposal form of {dao?.title}
					</div>
				)}
			</div>
		</div>
	);
};
