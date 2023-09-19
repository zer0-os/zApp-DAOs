import { useParams } from 'react-router-dom';
import { ProposalId } from '@zero-tech/zdao-sdk';
import { useCurrentDao, useDaoProposal } from 'lib/hooks';

export const useCurrentProposal = () => {
	const { proposalId } = useParams<{ proposalId: ProposalId }>();
	const { zna } = useCurrentDao();

	const query = useDaoProposal({
		proposalId,
		zna,
	});

	return {
		...query,
		zna,
		proposalId,
	};
};
