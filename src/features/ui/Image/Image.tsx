import type { FC } from 'react';

import React, { useState } from 'react';
import { LoadingIndicator } from '@zero-tech/zui/components';
import classNames from 'classnames/bind';
import styles from './Image.module.scss';

const cx = classNames.bind(styles);

type ImageProps = {
	url: string;
	alt?: string;
	classNames?: {
		container?: string;
		image?: string;
	};
};

export const Image: FC<ImageProps> = ({ url, alt, classNames }) => {
	const [isLoaded, setIsLoaded] = useState<boolean>(false);

	const onLoad = () => {
		setIsLoaded(true);
	};

	return (
		<div className={cx(styles.Container, classNames?.container)}>
			{!isLoaded && <LoadingIndicator />}

			<img
				src={url}
				onLoad={onLoad}
				alt={alt ?? ''}
				className={cx(styles.Image, classNames?.image, {
					IsLoaded: isLoaded
				})}
			/>
		</div>
	);
};
