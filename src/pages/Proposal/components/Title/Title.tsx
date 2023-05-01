import React from 'react';

import { MaybeSkeletonText } from '@zero-tech/zui/components';

import styles from './Title.module.scss';

export interface TitleProps {
	title?: string;
}

export const Title = ({ title }: TitleProps) => {
	return (
		<div className={styles.Title}>
			<MaybeSkeletonText
				text={{ text: title, isLoading: !title }}
				skeletonOptions={{ width: '50%' }}
			/>
		</div>
	);
};
