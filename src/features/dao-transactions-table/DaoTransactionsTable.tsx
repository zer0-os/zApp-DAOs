import type { FC } from 'react';
import type { zDAO } from '@zero-tech/zdao-sdk';

import React from 'react';

type DaoTransactionsTableProps = {
	dao?: zDAO;
};

export const DaoTransactionsTable: FC<DaoTransactionsTableProps> = ({
	dao
}) => {
	return <>Transactions Table of {dao?.title}</>;
};
