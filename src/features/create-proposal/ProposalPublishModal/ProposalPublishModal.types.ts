import type { CreateProposalProps } from '../CreateProposal.types';

export type ProposalPublishModalProps = Pick<CreateProposalProps, 'dao'> & {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	token: string;
	amount: string;
	recipient: string;
	body: string;
};
