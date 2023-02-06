import type { FC } from 'react';

import React, { useMemo } from 'react';

// - Library
import { truncateAddress } from '@zero-tech/zui/utils/formatting/addresses';

// Styles
import classNames from 'classnames';
import styles from './EtherscanLink.module.scss';

// - Types
import type { EtherscanLinkProps } from './EtherscanLink.types';

export const EtherscanLink: FC<EtherscanLinkProps> = ({
	etherscanUri,
	address = '',
	shouldTruncated = true,
	className = '',
	type = 'address',
	label
}) => {
	const linkPresentation = useMemo(() => {
		if (type === 'address') {
			if (!address || !shouldTruncated) return address;

			return truncateAddress(address);
		} else {
			return label;
		}
	}, [shouldTruncated, address, type, label]);

	if (!linkPresentation) return null;

	return (
		<a
			className={classNames(styles.Link, className)}
			href={`${etherscanUri}${type}/${address}`}
			target="_blank"
			rel="noreferrer"
		>
			{linkPresentation}
		</a>
	);
};
