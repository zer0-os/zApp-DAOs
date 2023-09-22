import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useFormContext } from 'react-hook-form';
import { parseUnits } from 'ethers/lib/utils';
import { useWeb3 } from 'lib/hooks';
import { useRoute } from 'lib/hooks/state/useRoute';
import { useSubmitProposal } from '../../lib/useSubmitProposal';

import { Alert, Button, Modal, Wizard } from '@zero-tech/zui/components';

import styles from '../CreateProposalForm/Form.module.scss';

interface CreateProposalModalProps {
	onClose: () => void;
}

enum CreateProposalStep {
	CONFIRM,
	LOADING,
	SUCCESS,
	ERROR,
}

export const CreateProposalModal = ({ onClose }: CreateProposalModalProps) => {
	const form = useFormContext();
	const { account } = useWeb3();
	const { submitProposal } = useSubmitProposal();

	const [step, setStep] = useState<CreateProposalStep>(
		CreateProposalStep.CONFIRM,
	);

	const history = useHistory();
	const { url } = useRoute();

	const [newProposalId, setNewProposalId] = useState<string | undefined>();

	const handleOnClickPublish = () => {
		const { title, body, recipient, amount, token } = form.getValues();
		setStep(CreateProposalStep.LOADING);

		submitProposal(
			{
				title,
				body,
				transfer: {
					sender: account,
					recipient,
					amount: parseUnits(amount.toString()).toString(),
					token,
					decimals: 18,
					symbol: 'mWILD',
				},
			},
			{
				onSuccess: (proposalId) => {
					setNewProposalId(proposalId);
					setStep(CreateProposalStep.SUCCESS);
				},
				onError: () => {
					setStep(CreateProposalStep.ERROR);
				},
			},
		);
	};

	return (
		<Modal className={styles.Modal} open={true} onOpenChange={onClose}>
			<Wizard.Container header={'Publish Proposal'}>
				<p>{getMessage(step)}</p>
				{step === CreateProposalStep.ERROR && (
					<Alert variant={'error'}>Failed to publish proposal</Alert>
				)}
				{step === CreateProposalStep.SUCCESS && (
					<Alert variant={'success'}>Your proposal is live</Alert>
				)}
				<div className={styles.Buttons}>
					<Button onPress={onClose} variant={'text'}>
						Cancel
					</Button>
					{step === CreateProposalStep.CONFIRM && (
						<Button onPress={handleOnClickPublish}>Publish</Button>
					)}
					{step === CreateProposalStep.ERROR && (
						<Button onPress={handleOnClickPublish}>Try Again</Button>
					)}
					{step === CreateProposalStep.LOADING && (
						<Button isDisabled={true}>Publishing</Button>
					)}
					{step === CreateProposalStep.SUCCESS && (
						<Button
							onPress={() => {
								history.push(url.replace('/create', `/${newProposalId}`));
							}}
						>
							Finish
						</Button>
					)}
				</div>
			</Wizard.Container>
		</Modal>
	);
};

const getMessage = (step: CreateProposalStep) => {
	if (step === CreateProposalStep.LOADING) {
		return 'Publishing proposal...';
	}

	if (step === CreateProposalStep.SUCCESS) {
		return 'Your proposal is successfully published and is now live for voting.';
	}

	return (
		<>
			Once your proposal is published it will be visible to the world and you
			will <b>not</b> be able to make any changes.
		</>
	);
};
