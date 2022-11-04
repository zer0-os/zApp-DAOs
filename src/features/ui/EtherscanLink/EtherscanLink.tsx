import type { FC } from 'react';

import React, { useMemo } from 'react';

// - Library
import { truncateWalletAddress } from '../../../lib/util/domains';

// Styles
import classNames from 'classnames';
import styles from './EtherscanLink.module.scss';

// - Types
import type { EtherscanLinkProps } from './EtherscanLink.types';

export const EtherscanLink: FC<EtherscanLinkProps> = ({
	etherscanUri,
	address = '',
	shouldTruncated = true,
	truncatingStartCharactersCount = 4,
	className = '',
	type = 'address',
	label
}) => {
	const linkPresentation = useMemo(() => {
		if (type === 'address') {
			if (!address || !shouldTruncated) return address;

			return truncateWalletAddress(address, truncatingStartCharactersCount);
		} else {
			return label;
		}
	}, [shouldTruncated, address, truncatingStartCharactersCount, type, label]);

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
