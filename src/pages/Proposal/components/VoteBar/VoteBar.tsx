import React, { useMemo } from 'react';

import type { Vote } from '@zero-tech/zdao-sdk';

import classNames from 'classnames/bind';
import styles from './VoteBar.module.scss';

const cx = classNames.bind(styles);

/////////////
// VoteBar //
/////////////

type VoteBarProps = {
	votes: Vote[];
};

export const VoteBar: React.FC<VoteBarProps> = ({ votes = [] }) => {
	const { optionOne, optionTwo } = useVotePercentage({ votes });

	return (
		<div className={styles.Container}>
			<span className={`${styles.ValueLabel} ${styles.ValueLabelLeft}`}>
				{optionOne.toFixed(2)}%
			</span>
			<div
				className={cx(styles.Progressbar, {
					Empty: optionOne === 0 && optionTwo === 0
				})}
			>
				<div
					className={`${styles.ProgressbarItem} ${styles.ProgressbarItemLeft}`}
					style={{ width: `${optionOne}%` }}
				></div>
				<div
					className={`${styles.ProgressbarItem} ${styles.ProgressbarItemRight}`}
					style={{ width: `${optionTwo}%` }}
				></div>
			</div>
			<span className={`${styles.ValueLabel} ${styles.ValueLabelRight}`}>
				{optionTwo.toFixed(2)}%
			</span>
		</div>
	);
};

///////////////////////
// useVotePercentage //
///////////////////////

interface UseVotePercentageParams {
	votes: Vote[];
}

const useVotePercentage = ({ votes }: UseVotePercentageParams) => {
	const percentage = useMemo(() => {
		const optionOne = getPercentageOfVotes(votes, 1);
		return [optionOne, 100 - optionOne];
	}, [votes]);

	return { optionOne: percentage[0], optionTwo: percentage[1] };
};

const getPercentageOfVotes = (votes: Vote[], choice: Vote['choice']) => {
	const totalVotes = votes.length;
	const votesForOption = votes.filter((vote) => vote.choice === choice).length;
	return totalVotes === 0 ? 0 : (votesForOption / totalVotes) * 100;
};
