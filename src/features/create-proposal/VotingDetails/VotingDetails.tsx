import type { FC } from 'react';
import type { VotingDetailItem } from './VotingDetails.types';

import React from 'react';
import { InfoTooltip } from '@zero-tech/zui/components/InfoTooltip';
import { getVotingDetails } from './VotingDetails.helpers';
import parentStyles from '../CreateProposal.module.scss';
import styles from './VotingDetails.module.scss';

export const VotingDetails: FC = () => {
	const votingDetails: VotingDetailItem[] = getVotingDetails();

	return (
		<div className={parentStyles.Section}>
			{/* Title */}
			<h2 className={parentStyles.SectionTitle}>
				Vote Details
				<InfoTooltip content="These settings are defined by the DAO" />
			</h2>

			<div className={styles.Row}>
				{votingDetails.map((votingDetail) => (
					<div className={styles.Col} key={JSON.stringify(votingDetail)}>
						<span className={styles.Label}>{votingDetail.label}</span>
						<span className={styles.Value}>{votingDetail.value} </span>
					</div>
				))}
			</div>
		</div>
	);
};
