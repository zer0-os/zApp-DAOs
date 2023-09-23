import React, { Fragment } from 'react';

import { Controller, useFormContext } from 'react-hook-form';
import { truncateAddress } from '@zero-tech/zui/utils';
import { useWeb3 } from 'lib/hooks';

import { Input, MarkdownEditor, Tooltip } from '@zero-tech/zui/components';
import { NumberInput } from '@zero-tech/zui/components/Input/NumberInput';

import styles from './Form.module.scss';
import { IconHelpCircle } from '@zero-tech/zui/icons';

export const TitleInput = () => {
	const {
		control,
		formState: { errors },
	} = useFormContext();

	return (
		<Controller
			control={control}
			defaultValue={''}
			name="title"
			rules={{ required: true }}
			render={({ field }) => (
				<Input
					error={Boolean(errors.title)}
					alert={
						Boolean(errors.title) && {
							variant: 'error',
							text: errors.title.message,
						}
					}
					label={'Proposal Title'}
					{...field}
				/>
			)}
		/>
	);
};

export const TokenInput = () => {
	const {
		control,
		formState: { errors },
	} = useFormContext();

	return (
		<Controller
			control={control}
			defaultValue={''}
			name="token"
			rules={{ required: true }}
			render={({ field }) => (
				<Input
					error={Boolean(errors.token)}
					alert={
						Boolean(errors.token) && {
							variant: 'error',
							text: errors.token.message,
						}
					}
					label={'Token'}
					{...field}
				/>
			)}
		/>
	);
};

export const AmountInput = () => {
	const {
		control,
		formState: { errors },
	} = useFormContext();

	return (
		<Controller
			control={control}
			defaultValue={''}
			name="amount"
			rules={{ required: true }}
			render={({ field }) => (
				<NumberInput
					error={Boolean(errors.amount)}
					alert={
						Boolean(errors.amount) && {
							variant: 'error',
							text: errors.amount.message,
						}
					}
					label={'Amount'}
					{...field}
				/>
			)}
		/>
	);
};

export const FromInput = () => {
	const { account } = useWeb3();
	const { control } = useFormContext();

	return (
		<Controller
			control={control}
			defaultValue={truncateAddress(account)}
			name="from"
			rules={{ required: true }}
			render={({ field }) => (
				<Input
					isDisabled={true}
					label={
						<Fragment>
							From{' '}
							<Tooltip
								content={'Funds will be transferred from the DAO treasury.'}
							>
								<IconHelpCircle className={styles.HelpIcon} size={16} />
							</Tooltip>
						</Fragment>
					}
					{...field}
				/>
			)}
		/>
	);
};

export const RecipientInput = () => {
	const {
		control,
		formState: { errors },
	} = useFormContext();

	return (
		<Controller
			control={control}
			defaultValue={''}
			name="recipient"
			rules={{ required: true }}
			render={({ field }) => (
				<Input
					error={Boolean(errors.recipient)}
					alert={
						Boolean(errors.recipient) && {
							variant: 'error',
							text: errors.recipient.message,
						}
					}
					label={'Recipient'}
					{...field}
				/>
			)}
		/>
	);
};

export const BodyInput = () => {
	const {
		control,
		formState: { errors },
	} = useFormContext();

	return (
		<Controller
			control={control}
			defaultValue={''}
			name="body"
			rules={{ required: true }}
			render={({ field }) => (
				<Fragment>
					<input hidden={true} {...field}></input>
					<MarkdownEditor
						error={Boolean(errors.body)}
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						errorText={errors.body?.message}
						text={field.value}
						onChange={field.onChange}
						className={styles.Markdown}
					/>
				</Fragment>
			)}
		/>
	);
};
