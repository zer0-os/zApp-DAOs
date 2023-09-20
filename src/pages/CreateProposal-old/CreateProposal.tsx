import React from 'react';

import { CreateProposal as CreateProposalFeature } from 'features/create-proposal';
import { useCurrentDao } from 'lib/hooks';

export const CreateProposal = () => {
	const { dao, zna } = useCurrentDao();

	return <CreateProposalFeature isLoadingDao={false} dao={dao} zna={zna} />;
};
