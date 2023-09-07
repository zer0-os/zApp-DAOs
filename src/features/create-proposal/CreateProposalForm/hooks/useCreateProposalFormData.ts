import type { Asset } from '../../../../lib/types/dao';
import type { CreateProposalFormData } from './useCreateProposalFormData.types';

import { useMemo, useState } from 'react';
import { AssetType } from '@zero-tech/zdao-sdk';
import { usePropsState } from '../../../../lib/hooks';

export const useCreateProposalFormData = (
	assets?: Asset[],
): CreateProposalFormData => {
	const tokenDropdownOptions = useMemo(() => {
		if (!assets) return [];

		return assets
			.filter((asset) =>
				[AssetType.NATIVE_TOKEN || AssetType.ERC20].includes(asset.type),
			)
			.map((asset) => ({
				title: asset.name,
				value: asset.address,
			}));
	}, [assets]);

	const [formValues, setFormValues] = usePropsState<
		CreateProposalFormData['formValues']
	>({
		title: '',
		tokenOption: tokenDropdownOptions?.[0],
		amount: '',
		recipient: '',
		body: '',
	});
	const [isOpenPublishModal, setIsOpenPublishModal] =
		useState<CreateProposalFormData['isOpenPublishModal']>(false);

	const [isFormChanged, setIsFormChanged] =
		useState<CreateProposalFormData['isFormChanged']>(false);

	const onSubmit: CreateProposalFormData['onSubmit'] = (values) => {
		setFormValues(values);
		setIsOpenPublishModal(true);
	};

	return {
		isOpenPublishModal,
		setIsOpenPublishModal,
		isFormChanged,
		setIsFormChanged,
		tokenOptions: tokenDropdownOptions,
		formValues,
		onSubmit,
	};
};
