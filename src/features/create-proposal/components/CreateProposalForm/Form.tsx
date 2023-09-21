import React, { useRef, useState } from 'react';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWeb3 } from 'lib/hooks';
import { schema } from './lib/validation';

import { ConnectWallet } from 'features/ui';
import { Attribute, Attributes } from 'features/ui/Attributes/Attributes';
import { Button, TextStack } from '@zero-tech/zui/components';
import { CreateProposalModal } from '../CreateProposalModal';
import {
	AmountInput,
	BodyInput,
	FromInput,
	RecipientInput,
	TitleInput,
	TokenInput,
} from './inputs';

import styles from './Form.module.scss';

export const CreateProposalForm = () => {
	const { account } = useWeb3();
	const submitButtonRef = useRef<HTMLButtonElement>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const methods = useForm({
		resolver: zodResolver(schema),
	});

	if (!account) {
		return (
			<div>
				<ConnectWallet
					message={'Please connect a Web3 wallet to create a proposal'}
				/>
			</div>
		);
	}

	const handleOnSubmit = () => {
		setIsSubmitting(true);
	};

	return (
		<FormProvider {...methods}>
			{isSubmitting && (
				<CreateProposalModal onClose={() => setIsSubmitting(false)} />
			)}
			<form
				className={styles.Form}
				onSubmit={methods.handleSubmit(handleOnSubmit)}
			>
				<TitleInput />
				<TextStack
					label={''}
					primaryText={'Fund details'}
					secondaryText={
						'Proposals are currently limited to transferring tokens from the DAO treasury to a recipient'
					}
				/>
				<div className={styles.Grid}>
					<TokenInput />
					<AmountInput />
					<FromInput />
					<RecipientInput />
				</div>
				<BodyInput />
				<TextStack label={''} primaryText={'Vote Details'} secondaryText={''} />
				<Attributes>
					<Attribute label={'Vote Duration'} value={'7 days'} />
					<Attribute label={'Voting Ends'} value={'7 days'} />
					<Attribute label={'Voting System'} value={'Weighted Single Choice'} />
					<Attribute label={'Execution Criteria'} value={'Absolute Majority'} />
				</Attributes>
				<button ref={submitButtonRef} hidden type={'submit'}></button>
				<Button onPress={() => submitButtonRef.current?.click()}>
					Publish Proposal
				</Button>
			</form>
		</FormProvider>
	);
};
