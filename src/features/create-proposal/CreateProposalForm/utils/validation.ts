import * as Yup from 'yup';
import { ethers } from 'ethers';

export const validationSchema = Yup.object().shape({
	title: Yup.string().required('Please enter a title for your proposal'),
	amount: Yup.string().required('Please enter an amount you wish to send'),
	recipient: Yup.string()
		.required('Please enter a recipient wallet address')
		.test(
			'isValidERC20Address',
			'Please enter a valid ethereum wallet address',
			ethers.utils.isAddress
		),
	body: Yup.string().required(
		'Please add a description to your funding proposal'
	)
});
