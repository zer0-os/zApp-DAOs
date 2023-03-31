import type { CreateProposalProps } from '../CreateProposal.types';
import type { Asset } from '../../../lib/types/dao';

export type CreateProposalFormProps = Pick<CreateProposalProps, 'dao'> & {
	assets: Asset[];
	zna: string;
};
