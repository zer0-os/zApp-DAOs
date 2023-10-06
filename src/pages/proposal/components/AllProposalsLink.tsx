import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { BackLinkButton } from '../../../features/ui';
import { cloneDeep } from 'lodash';

export const AllProposalsLink = () => {
	const history = useHistory();

	const toAllProposals = useMemo(() => {
		const pathname = history.location.pathname.replace(
			/\/proposals\/.*/,
			'/proposals',
		);
		const state = cloneDeep(history.location.state);

		return {
			pathname,
			state,
		};
	}, [history]);

	return <BackLinkButton label="All Proposals" to={toAllProposals} />;
};
