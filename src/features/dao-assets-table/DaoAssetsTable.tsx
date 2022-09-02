import type { FC } from 'react';
import type { zDAO } from '@zero-tech/zdao-sdk';

import React from 'react';

type DaoAssetsTableProps = {
	dao?: zDAO;
};

export const DaoAssetsTable: FC<DaoAssetsTableProps> = ({ dao }) => {
	return <>Assets Table of {dao?.title}</>;
};
