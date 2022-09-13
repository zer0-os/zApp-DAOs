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
	className = ''
}) => {
	const linkPresentation = useMemo(() => {
		if (!address || !shouldTruncated) return address;

		return truncateWalletAddress(address, truncatingStartCharactersCount);
	}, [shouldTruncated, address, truncatingStartCharactersCount]);

	if (!linkPresentation) return null;

	return (
		<a
			className={classNames(styles.Link, className)}
			href={`${etherscanUri}address/${address}`}
			target="_blank"
			rel="noreferrer"
		>
			{linkPresentation}
		</a>
	);
};
