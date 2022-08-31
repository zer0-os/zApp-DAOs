import type { FC } from 'react';

import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { IconArrowLeft } from '../Icons';
import styles from './BackLinkButton.module.scss';

const cx = classNames.bind(styles);

type BackLinkButtonProps = {
	to: string;
	label: string;
	className?: string;
};

export const BackLinkButton: FC<BackLinkButtonProps> = ({
	to,
	label,
	className
}) => {
	return (
		<Link className={cx(styles.Link, className)} to={to}>
			<IconArrowLeft /> {label}
		</Link>
	);
};
