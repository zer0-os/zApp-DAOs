import type { Option } from '../../../ui';

export type CreateProposalFormValues = {
	title: string;
	tokenOption: Option;
	amount: string;
	recipient: string;
	body: string;
};

export type CreateProposalFormData = {
	isFormChanged: boolean;
	setIsFormChanged: (value: boolean) => void;
	isOpenPublishModal: boolean;
	setIsOpenPublishModal: (value: boolean) => void;
	tokenOptions: Option[];
	formValues: CreateProposalFormValues;
	onSubmit: (values: CreateProposalFormValues) => void;
};
