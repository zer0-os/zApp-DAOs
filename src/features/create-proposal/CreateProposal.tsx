import type { FC } from 'react';
import type { CreateProposalProps } from './CreateProposal.types';

import React, { useLayoutEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { LoadingIndicator } from '@zero-tech/zui/components';
import { useUserPaymentTokenBalance, useDaoAssets } from '../../lib/hooks';
import { DAO_CREATE_PROPOSAL } from '../../pages/DAO/DAO.constants';
import { BackLinkButton } from '../ui';
import { CreateProposalForm } from './CreateProposalForm';
import styles from './CreateProposal.module.scss';

export const CreateProposal: FC<CreateProposalProps> = ({
	isLoadingDao,
	dao
}) => {
	// Hooks
	const history = useHistory();
	const { data: assets } = useDaoAssets(dao);
	const {
		isLoading: isLoadingPaymentTokenBalance,
		data: userPaymentTokenBalance
	} = useUserPaymentTokenBalance(dao?.votingToken.token);

	// Data
	const isLoading = isLoadingDao || isLoadingPaymentTokenBalance;
	const isHoldingVotingToken = !userPaymentTokenBalance?.gt(0);
	const toAllProposals = history.location.pathname.replace(
		`/${DAO_CREATE_PROPOSAL}`,
		''
	);

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
				{isLoading && (
					<LoadingIndicator
						className={styles.Loading}
						text="Loading dao"
						spinnerPosition="left"
					/>
				)}

				{!isLoading &&
					(isHoldingVotingToken ? (
						<div className={styles.TokenError}>
							To create a proposal, you need to be holding the {dao.title}{' '}
							voting token
							{dao.votingToken.symbol && ` (${dao.votingToken.symbol})`}.
						</div>
					) : (
						<div className={styles.Wrapper}>
							{/* Title */}
							<h1 className={styles.Title}>Create a Proposal</h1>

							{/* Form */}
							<CreateProposalForm dao={dao} assets={assets} />
						</div>
					))}
			</div>
		</div>
	);
};
