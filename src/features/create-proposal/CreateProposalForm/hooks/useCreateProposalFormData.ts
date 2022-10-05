import type { Asset } from '../../../../lib/types/dao';
import type { CreateProposalFormData } from './useCreateProposalFormData.types';

import { useState, useMemo } from 'react';
import { AssetType } from '@zero-tech/zdao-sdk';
import { usePropsState } from '../../../../lib/hooks';

export const useCreateProposalFormData = (
	assets?: Asset[]
): CreateProposalFormData => {
	const tokenDropdownOptions = useMemo(() => {
		if (!assets) return [];

		return assets
			.filter((asset) => asset.type === AssetType.ERC20)
			.map((asset) => ({
				title: asset.name,
				value: asset.address
			}));
	}, [assets]);

	const [formValues, setFormValues] = usePropsState<
		CreateProposalFormData['formValues']
	>({
		title: '',
		tokenOption: tokenDropdownOptions?.[0],
		amount: '',
		recipient: '',
		body: ''
	});
	const [isOpenPublishModal, setIsOpenPublishModal] =
		useState<CreateProposalFormData['isOpenPublishModal']>(false);

	const [isFormChanged, setIsFormChanged] =
		useState<CreateProposalFormData['isFormChanged']>(false);

	const tokenOptions: CreateProposalFormData['tokenOptions'] = useMemo(() => {
		if (!formValues.tokenOption) {
			return tokenDropdownOptions;
		}

		const unselectedTokenOptions = tokenDropdownOptions.filter(
			({ value }) => value !== formValues.tokenOption.value
		);

		return [formValues.tokenOption, ...unselectedTokenOptions];
	}, [tokenDropdownOptions, formValues.tokenOption]);

	const onSubmit: CreateProposalFormData['onSubmit'] = (values) => {
		setFormValues(values);
		setIsOpenPublishModal(true);
	};

	return {
		isOpenPublishModal,
		setIsOpenPublishModal,
		isFormChanged,
		setIsFormChanged,
		tokenOptions,
		formValues,
		onSubmit
	};
};
