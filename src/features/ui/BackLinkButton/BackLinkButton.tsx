import type { FC } from 'react';
import type { LinkProps } from 'react-router-dom';

import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { IconArrowLeft } from '../Icons';
import styles from './BackLinkButton.module.scss';

type BackLinkButtonProps = {
	to: LinkProps['to'];
	label: string;
	className?: string;
};

export const BackLinkButton: FC<BackLinkButtonProps> = ({
	to,
	label,
	className
}) => {
	return (
		<Link className={classNames(styles.Link, className)} to={to}>
			<IconArrowLeft /> {label}
		</Link>
	);
};
