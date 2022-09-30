import type { FC } from 'react';
import type { CreateProposalFormProps } from './CreateProposalForm.types';
import type { Option } from '../../ui';

import React, { useState, useMemo } from 'react';
import classNames from 'classnames/bind';
import { isEmpty } from 'lodash';
import { Input, Button } from '@zero-tech/zui/components';
import { InfoTooltip } from '@zero-tech/zui/components/InfoTooltip';
import { EtherscanLink, Select, MarkDownEditor } from '../../ui';
import { useWeb3, usePropsState } from '../../../lib/hooks';
import { getEtherscanUri } from '../../../lib/util/network';
import { VotingDetails } from '../VotingDetails';
import { ProposalPublishModal } from '../ProposalPublishModal';
import {
	getTokenOptionsFromAssets,
	getProposalFormErrors
} from './CreateProposalForm.helpers';
import parentStyles from '../CreateProposal.module.scss';
import styles from './CreateProposalForm.module.scss';

const cx = classNames.bind(styles);

export const CreateProposalForm: FC<CreateProposalFormProps> = ({
	dao,
	assets
}) => {
	// Hooks
	const { chainId } = useWeb3();

	const etherscanUri = getEtherscanUri(chainId);
	const tokenDropdownOptions = getTokenOptionsFromAssets(assets);

	// States
	const [title, setTitle] = useState<string>('');
	const [tokenOption, setTokenOption] = usePropsState<Option>(
		tokenDropdownOptions?.[0]
	);
	const [amount, setAmount] = useState<string>('');
	const [recipient, setRecipient] = useState<string>('');
	const [body, setBody] = useState<string>('');
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [isOpenPublishModal, setIsOpenPublishModal] = useState<boolean>(false);

	// Memoized Data
	const tokenOptions = useMemo(() => {
		if (!tokenOption) {
			return tokenDropdownOptions;
		}

		const unselectedTokenOptions = tokenDropdownOptions.filter(
			({ value }) => value !== tokenOption.value
		);

		return [tokenOption, ...unselectedTokenOptions];
	}, [tokenDropdownOptions, tokenOption]);

	// Handlers
	const onChange = (key: string) => (value?: string) => {
		if (key === 'title') setTitle(value);
		else if (key === 'amount') setAmount(value);
		else if (key === 'recipient') setRecipient(value);
		else if (key === 'body') setBody(value);

		setErrors({
			...errors,
			...getProposalFormErrors({ [key]: value })
		});
	};

	const onSubmit = () => {
		const errors = getProposalFormErrors({ title, amount, recipient, body });

		Object.keys(errors).forEach((key) => {
			if (typeof errors[key] === 'undefined') delete errors[key];
		});

		if (!isEmpty(errors)) {
			setErrors(errors);
		} else {
			togglePublishModal(true)();
		}
	};

	const togglePublishModal = (isOpen: boolean) => () => {
		setIsOpenPublishModal(isOpen);
	};

	return (
		<div className={styles.Form}>
			{/* Proposal Title Input */}
			<div className={parentStyles.Section}>
				<Input
					label="Proposal Title"
					placeholder="Proposal Title"
					value={title}
					onChange={onChange('title')}
					error={Boolean(errors['title'])}
					helperText={errors['title']}
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
							selected={tokenOption}
							onSelect={setTokenOption}
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
							value={amount}
							onChange={onChange('amount')}
							error={Boolean(errors['amount'])}
							helperText={errors['amount']}
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
								DAO Wallet:{' '}
								<EtherscanLink
									etherscanUri={etherscanUri}
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
							value={recipient}
							onChange={onChange('recipient')}
							error={Boolean(errors['recipient'])}
							helperText={errors['recipient']}
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
					<MarkDownEditor
						classNames={{
							container: cx(styles.MarkdownEditorContainer, {
								Error: Boolean(errors['body'])
							}),
							error: styles.MarkdownEditorError
						}}
						text={body}
						placeholder="Proposal Content"
						onChange={onChange('body')}
						errorText={errors['body']}
					/>
				</div>
			</div>

			{/* Voting Details Section */}
			<VotingDetails />

			{/* Publish Button */}
			<div className={classNames(parentStyles.Section, styles.SubmitSection)}>
				<Button onPress={onSubmit}>Publish Proposal</Button>
			</div>

			{/* Publish Modal */}
			{isOpenPublishModal && (
				<ProposalPublishModal
					dao={dao}
					isOpen={isOpenPublishModal}
					onClose={togglePublishModal(false)}
					title={title}
					amount={amount}
					token={tokenOption?.value}
					recipient={recipient}
					body={body}
				/>
			)}
		</div>
	);
};
