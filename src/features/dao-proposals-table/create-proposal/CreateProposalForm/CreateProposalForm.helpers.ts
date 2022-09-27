import type { Asset } from '../../../../lib/types/dao';
import type { Option } from '../../../ui';

import { AssetType } from '@zero-tech/zdao-sdk';
import { ethers } from 'ethers';

export const getTokenOptionsFromAssets = (assets?: Asset[]): Option[] => {
	if (!assets) return [];

	return assets
		.filter((asset) => asset.type === AssetType.ERC20)
		.map((asset) => ({
			title: asset.name,
			value: asset.address
		}));
};

export const isValidERC20Address = (address: string): boolean => {
	return ethers.utils.isAddress(address);
};

export const getProposalFormErrors = ({
	title,
	amount,
	recipient,
	body
}: {
	title?: string;
	amount?: string;
	recipient?: string;
	body?: string;
}) => {
	const errors = {};

	if (title === '') {
		errors['title'] = 'Please enter a title for your proposal';
	} else {
		errors['title'] = undefined;
	}

	if (amount === '') {
		errors['amount'] = 'Please enter an amount you wish to send';
	} else if (amount) {
		errors['amount'] = undefined;
	}

	if (recipient === '') {
		errors['recipient'] = 'Please enter a recipient wallet address';
	} else if (recipient && !isValidERC20Address(recipient)) {
		errors['recipient'] = 'Please enter a valid ethereum wallet address';
	} else if (recipient) {
		errors['recipient'] = undefined;
	}

	if (body === '') {
		errors['body'] = 'Please add a description to your funding proposal';
	} else if (body) {
		errors['body'] = undefined;
	}

	return errors;
};
