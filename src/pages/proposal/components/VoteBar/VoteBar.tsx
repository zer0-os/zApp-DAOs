import { useMemo } from 'react';

import styles from './VoteBar.module.scss';

type VoteBarProps = {
	options: string[];
	scores: number[];
};

export const VoteBar = ({ scores, options }: VoteBarProps) => {
	const barData = useMemo(() => {
		const totalVotes = scores.reduce((acc, score) => acc + score, 0);
		const shouldShowBar = Boolean(totalVotes);
		return {
			shouldShowBar,
			shouldShowLabels: shouldShowBar && options.length === 2,
			bars: scores.map((score, index) => ({
				percentage: totalVotes ? (score / totalVotes) * 100 : 0,
				option: options[index],
				score,
			})),
		};
	}, [options, scores]);

	if (!barData.shouldShowBar) {
		return null;
	}

	return (
		<div className={styles.Container}>
			{barData.shouldShowLabels && (
				<span>{Math.round(barData.bars[0].percentage ?? 0)}%</span>
			)}
			<div className={styles.Options}>
				{barData.bars.map((bar) => (
					<div
						key={bar.option + bar.percentage}
						style={{ width: bar.percentage + '%' }}
						className={styles.Option}
					></div>
				))}
			</div>
			{barData.shouldShowLabels && (
				<span>{Math.round(barData.bars[1].percentage ?? 0)}%</span>
			)}
		</div>
	);
};
