import React, { FC } from 'react';

import { ethers } from 'ethers';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { getEtherscanUri } from '../../../lib/util/network';
import { useRouteChangeDialog, useWeb3 } from '../../../lib/hooks';
import { useCreateProposalFormData } from './hooks';
import type { CreateProposalFormProps } from './CreateProposalForm.types';

import { Button, Input, MarkdownEditor } from '@zero-tech/zui/components';
import { InfoTooltip } from '@zero-tech/zui/components/InfoTooltip';
import { EtherscanLink, Select } from '../../ui';
import { VotingDetails } from '../VotingDetails';
import { ProposalPublishModal } from '../ProposalPublishModal';

import classNames from 'classnames';
import parentStyles from '../CreateProposal.module.scss';
import styles from './CreateProposalForm.module.scss';

const validationSchema = Yup.object().shape({
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

export const CreateProposalForm: FC<CreateProposalFormProps> = ({
	dao,
	assets,
	zna
}) => {
	const { chainId } = useWeb3();
	const {
		isFormChanged,
		setIsFormChanged,
		isOpenPublishModal,
		setIsOpenPublishModal,
		tokenOptions,
		formValues,
		onSubmit
	} = useCreateProposalFormData(assets);

	useRouteChangeDialog(
		{
			title: 'Discard Proposal?',
			message: 'If you leave now you will lose your progress on this proposal',
			confirmButtonConfig: {
				text: 'Discard Proposal'
			},
			cancelButtonConfig: {
				text: 'Keep Editing'
			}
		},
		isFormChanged
	);

	return (
		<>
			<Formik
				initialValues={formValues}
				validationSchema={validationSchema}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ values, errors, touched, dirty, setFieldValue, submitForm }) => {
					setIsFormChanged(dirty);

					return (
						<Form>
							<div className={styles.Form}>
								{/* Proposal Title Input */}
								<div className={parentStyles.Section}>
									<Input
										label="Proposal Title"
										placeholder="Proposal Title"
										value={values.title}
										onChange={(value) => setFieldValue('title', value)}
										error={touched.title && !!errors.title}
										helperText={touched.title && errors.title}
									/>
								</div>

								{/* Fund Details Section */}
								<div className={parentStyles.Section}>
									{/* Title */}
									<h2 className={parentStyles.SectionTitle}>
										Fund Details
										<InfoTooltip content="Proposals are currently limited to transferring tokens from the DAO treasury to a recipient" />
									</h2>

									<div className={parentStyles.SectionContent}>
										{/* Token */}
										<div className={parentStyles.SectionContentCol}>
											<Select
												label="Token"
												options={tokenOptions}
												selected={values.tokenOption}
												onSelect={(value) =>
													setFieldValue('tokenOption', value)
												}
												classNames={{
													selected: styles.SelectedToken
												}}
											/>
										</div>
										{/* Amount */}
										<div className={parentStyles.SectionContentCol}>
											<Input
												type="number"
												label="Amount"
												placeholder="Amount"
												value={values.amount}
												onChange={(value) => setFieldValue('amount', value)}
												error={touched.amount && !!errors.amount}
												helperText={touched.amount && errors.amount}
											/>
										</div>
									</div>

									<div className={parentStyles.SectionContent}>
										{/* From */}
										<div className={styles.SectionContentCol}>
											<div className={styles.DaoAddress}>
												<div className={styles.DaoAddressHeader}>
													From
													<InfoTooltip content="Proposals are currently limited to transferring tokens from the DAO treasury to a recipient" />
												</div>
												<div className={styles.DaoAddressContent}>
													ViewDAO Wallet:{' '}
													<EtherscanLink
														etherscanUri={getEtherscanUri(chainId)}
														address={dao?.safeAddress}
													/>
												</div>
											</div>
										</div>

										{/* Recipient Address */}
										<div className={parentStyles.SectionContentCol}>
											<Input
												label="Recipient (ERC20 Address)"
												placeholder="Recipient Address"
												value={values.recipient}
												onChange={(value) => setFieldValue('recipient', value)}
												error={touched.recipient && !!errors.recipient}
												helperText={touched.recipient && errors.recipient}
											/>
										</div>
									</div>

									{/* Body (Markdown Editor) */}
									<div
										className={classNames(
											styles.SectionContentCol,
											styles.MarkdownEditorCol
										)}
									>
										<MarkdownEditor
											text={values.body}
											placeholder="Proposal Content"
											onChange={(value) => setFieldValue('body', value)}
											error={touched.body && !!errors.body}
											errorText={touched.body && errors.body}
										/>
									</div>
								</div>

								{/* Voting Details Section */}
								<VotingDetails />

								{/* Publish Button */}
								<div
									className={classNames(
										parentStyles.Section,
										styles.SubmitSection
									)}
								>
									<Button onPress={submitForm}>Publish Proposal</Button>
								</div>
							</div>
						</Form>
					);
				}}
			</Formik>

			{/* Publish Modal */}
			{isOpenPublishModal && (
				<ProposalPublishModal
					dao={dao}
					isOpen={isOpenPublishModal}
					onClose={() => setIsOpenPublishModal(false)}
					title={formValues.title}
					amount={formValues.amount}
					token={formValues.tokenOption?.value}
					recipient={formValues.recipient}
					body={formValues.body}
					zna={zna}
				/>
			)}
		</>
	);
};
