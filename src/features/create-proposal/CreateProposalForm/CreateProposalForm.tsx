/*
 * @note 25/04/2023 tonnes of refactoring to do here still
 */

import React, { FC } from 'react';

import { Form, Formik, useFormikContext } from 'formik';

import { useRouteChangeDialog } from '../../../lib/hooks';
import { CreateProposalFormValues, useCreateProposalFormData , TokenOption } from './hooks';

import {
	Button,
	Input,
	MarkdownEditor,
	SelectInput
} from '@zero-tech/zui/components';
import { ProposalPublishModal } from '../ProposalPublishModal';
import { Attribute, Attributes } from '../../ui/Attributes/Attributes';

import { truncateAddress } from '@zero-tech/zui/utils/formatting/addresses';
import { getVotingDetails, validationSchema } from './utils';

import { zDAO } from '@zero-tech/zdao-sdk';
import { CreateProposalProps } from '../CreateProposal.types';
import { Asset } from '../../../lib/types/dao';

import classNames from 'classnames';
import styles from './CreateProposalForm.module.scss';

//////////////////////////
// Create Proposal Form //
//////////////////////////

export type CreateProposalFormProps = Pick<CreateProposalProps, 'dao'> & {
	assets: Asset[];
	zna: string;
};

export const CreateProposalForm: FC<CreateProposalFormProps> = ({
	dao,
	assets,
	zna
}) => {
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
						<Form className={styles.Form}>
							<div className={styles.Section}>
								<Input
									label="Proposal Title"
									value={values.title}
									onChange={(value) => setFieldValue('title', value)}
									error={touched.title && !!errors.title}
									helperText={touched.title && errors.title}
								/>
							</div>

							<FundDetails dao={dao} tokenOptions={tokenOptions} />

							<VotingDetails />

							<div className={classNames(styles.Section, styles.SubmitSection)}>
								<Button onPress={submitForm}>Publish Proposal</Button>
							</div>
							<hr />
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

////////////////////
// Section Header //
////////////////////

interface SectionHeaderProps {
	header: string;
	subheader?: string;
}

export const SectionHeader = ({ header, subheader }: SectionHeaderProps) => {
	return (
		<div className={styles.Title}>
			<h2>{header}</h2>
			<span>{subheader}</span>
		</div>
	);
};

////////////////////
// Voting Details //
////////////////////

const VotingDetails: FC = () => {
	return (
		<div className={styles.Section}>
			<SectionHeader
				header={'Vote Details'}
				subheader={'These settings are defined by the DAO'}
			/>

			<Attributes>
				{getVotingDetails().map((votingDetail) => (
					<Attribute
						key={votingDetail.value}
						label={votingDetail.label}
						value={votingDetail.value}
					/>
				))}
			</Attributes>
		</div>
	);
};

//////////////////
// Fund Details //
//////////////////

interface FundDetailsProps {
	dao?: zDAO;
	tokenOptions?: TokenOption[];
}

const FundDetails = ({ tokenOptions, dao }: FundDetailsProps) => {
	const { values, errors, touched, setFieldValue } =
		useFormikContext<CreateProposalFormValues>();

	return (
		<div className={styles.Section}>
			<SectionHeader
				header={'Fund Details'}
				subheader={
					'Proposals are currently limited to transferring tokens from the DAO treasury to a recipient.'
				}
			/>

			<div className={styles.SectionContent}>
				<SelectInput
					className={styles.Token}
					label="Token"
					items={tokenOptions.map((token) => ({
						id: token.value,
						label: token.title,
						onSelect: () => setFieldValue('tokenOption', token)
					}))}
					value={values.tokenOption.title}
					placeholder={'Select a token'}
				/>
				<Input
					type="number"
					label="Amount"
					placeholder="Amount"
					value={values.amount}
					onChange={(value) => setFieldValue('amount', value)}
					error={touched.amount && !!errors.amount}
					helperText={touched.amount && errors.amount}
				/>
				<Input
					isDisabled={true}
					label={'From'}
					value={'DAO Wallet: ' + truncateAddress(dao?.safeAddress ?? '')}
					onChange={() => {}}
				/>
				<Input
					label="Recipient (ERC20 Address)"
					placeholder="Recipient Address"
					value={values.recipient}
					onChange={(value) => setFieldValue('recipient', value)}
					error={touched.recipient && !!errors.recipient}
					helperText={touched.recipient && errors.recipient}
				/>
			</div>

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
	);
};
