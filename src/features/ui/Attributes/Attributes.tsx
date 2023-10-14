/*
 * For rendering a list of attributes
 */

import React, { ReactNode } from 'react';

import { MaybeSkeletonText } from '@zero-tech/zui/components';

import styles from './Attributes.module.scss';

////////////////
// Attributes //
////////////////

export interface AttributeWrapperProps {
	children: ReactNode;
}

export const Attributes = ({ children }: AttributeWrapperProps) => {
	return (
		<div className={styles.Container}>
			<ul className={styles.Wrapper}>{children}</ul>
		</div>
	);
};

///////////////
// Attribute //
///////////////

export interface AttributeProps {
	label: string;
	value: ReactNode;
	isLoading?: boolean;
}

export const Attribute = ({ label, value, isLoading }: AttributeProps) => {
	return (
		<li className={styles.Attribute} key={label + value}>
			<MaybeSkeletonText
				text={{ text: label, isLoading }}
				className={styles.Traits}
				skeletonOptions={{
					width: '50%',
				}}
			/>
			<MaybeSkeletonText
				text={{ text: value, isLoading }}
				className={styles.Properties}
			/>
		</li>
	);
};
