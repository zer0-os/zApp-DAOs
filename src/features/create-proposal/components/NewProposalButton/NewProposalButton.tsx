import React from 'react';
import { useHistory } from 'react-router-dom';

import { DAO_CREATE_PROPOSAL } from 'pages';
import { useRoute } from 'lib/hooks/state/useRoute';

import { Button } from '@zero-tech/zui/components';

export const NewProposalButton = () => {
	const { url } = useRoute();
	const history = useHistory();

	const handleOnPressNewProposal = () => {
		history.push(`${url}/${DAO_CREATE_PROPOSAL}`.replace('//', '/'));
	};

	return <Button onPress={handleOnPressNewProposal}>New Proposal</Button>;
};
