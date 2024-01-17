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
		async ({ body, ...params }: SubmitProposalParams) => {
			const snapshot = await provider.getBlockNumber();
			if (body.length > 10000) {
				// Small wait for UX
				await new Promise((resolve) => setTimeout(resolve, 500));
				throw new Error('Proposal body is too long - max 10,000 characters');
			}
			try {
				return dao.createProposal(provider, account, {
					snapshot,
					duration: DEFAULT_VOTE_DURATION_SECONDS,
					choices: DEFAULT_VOTE_CHOICES,
					body,
					...(params as SubmitProposalParams),
				});
			} catch (e) {
				console.error(e);
				throw new Error('Failed to submit proposal');
			}
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
