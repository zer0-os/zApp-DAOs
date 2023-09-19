import React, { useMemo } from 'react';

import styles from './VoteBar.module.scss';

type VoteBarProps = {
	options: string[];
	scores: number[];
};

export const VoteBar = ({ scores, options }: VoteBarProps) => {
	const barData = useMemo(() => {
		const totalVotes = scores.reduce((acc, score) => acc + score, 0);
		return scores.map((score, index) => ({
			percentage: (score / totalVotes) * 100,
			option: options[index],
			score,
		}));
	}, [options, scores]);

	const shouldShowLabels = (barData.length = 2);

	return (
		<div className={styles.Container}>
			{shouldShowLabels && <span>{Math.round(barData[0].percentage)}%</span>}
			<div className={styles.Options}>
				{barData.map((bar) => (
					<div
						key={bar.option + bar.percentage}
						style={{ width: bar.percentage + '%' }}
						className={styles.Option}
					></div>
				))}
			</div>
			{shouldShowLabels && <span>{Math.round(barData[1].percentage)}%</span>}
		</div>
	);
};
