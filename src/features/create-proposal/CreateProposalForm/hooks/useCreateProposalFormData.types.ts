export interface TokenOption {
	title: string;
	value: string;
}

export type CreateProposalFormValues = {
	title: string;
	tokenOption: TokenOption;
	amount: string;
	recipient: string;
	body: string;
};

export type CreateProposalFormData = {
	isFormChanged: boolean;
	setIsFormChanged: (value: boolean) => void;
	isOpenPublishModal: boolean;
	setIsOpenPublishModal: (value: boolean) => void;
	tokenOptions: TokenOption[];
	formValues: CreateProposalFormValues;
	onSubmit: (values: CreateProposalFormValues) => void;
};
