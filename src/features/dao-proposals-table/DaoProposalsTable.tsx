import type { FC } from 'react';
import type { zDAO } from '@zero-tech/zdao-sdk';

import React from 'react';

type DaoProposalsTableProps = {
	dao?: zDAO;
};

export const DaoProposalsTable: FC<DaoProposalsTableProps> = ({ dao }) => {
	return <>Proposals Table of {dao?.title}</>;
};
