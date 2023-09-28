import { useMutation, useQueryClient } from 'react-query';

import { useCurrentDao, useWeb3 } from 'lib/hooks';
import { CreateProposalParams } from '@zero-tech/zdao-sdk';

const DEFAULT_VOTE_DURATION_SECONDS = 7 * 24 * 3600;
const DEFAULT_VOTE_CHOICES = ['Approve', 'Deny'];

export type SubmitProposalParams = Omit<
	CreateProposalParams,
	'snapshot' | 'duration' | 'choices'
>;

export const useSubmitProposal = () => {
	const { dao, zna } = useCurrentDao();
	const { provider, account } = useWeb3();
	const queryClient = useQueryClient();

	const { mutate: submitProposal, ...rest } = useMutation(
		[['dao', 'proposals', 'publish', { zna }]],
		async (params: SubmitProposalParams) => {
			const snapshot = await provider.getBlockNumber();
			return dao.createProposal(provider, account, {
				snapshot,
				duration: DEFAULT_VOTE_DURATION_SECONDS,
				choices: DEFAULT_VOTE_CHOICES,
				...(params as SubmitProposalParams),
			});
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['dao', 'proposals', { zna }]);
			},
		},
	);

	return {
		submitProposal,
		...rest,
	};
};
