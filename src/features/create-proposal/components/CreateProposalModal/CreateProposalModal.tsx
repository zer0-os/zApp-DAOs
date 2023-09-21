import React, { useState } from 'react';

import { useFormContext } from 'react-hook-form';
import { parseUnits } from 'ethers/lib/utils';
import { useWeb3 } from 'lib/hooks';
import { useSubmitProposal } from '../../lib/useSubmitProposal';

import { Alert, Button, Modal, Wizard } from '@zero-tech/zui/components';

import styles from '../CreateProposalForm/Form.module.scss';
import { truncateAddress } from '@zero-tech/zui/utils';

interface CreateProposalModalProps {
	onClose: () => void;
}

export const CreateProposalModal = ({ onClose }: CreateProposalModalProps) => {
	const { isError, isSuccess, isLoading } = useSubmitProposal();

	return (
		<Modal className={styles.Modal} open={true} onOpenChange={onClose}>
			<Wizard.Container header={'Publish Proposal'}>
				<p>{getMessage(isLoading, isSuccess)}</p>
				{isError && <Alert variant={'error'}>Failed to publish proposal</Alert>}
				<div className={styles.Buttons}>
					<Button onPress={onClose} variant={'text'}>
						Cancel
					</Button>
					<ModalButton />
				</div>
			</Wizard.Container>
		</Modal>
	);
};

const getMessage = (isLoading: boolean, isSuccess: boolean) => {
	if (isLoading) {
		return 'Publishing proposal...';
	}

	if (isSuccess) {
		return 'Your proposal is successfully published and is now live for voting.';
	}

	return (
		<>
			Once your proposal is published it will be visible to the world and you
			will <b>not</b> be able to make any changes.
		</>
	);
};

const ModalButton = () => {
	const form = useFormContext();
	const { account } = useWeb3();

	const [newProposalId, setNewProposalId] = useState<string | undefined>();

	const { submitProposal, isError, isSuccess, isLoading } = useSubmitProposal();

	const handleOnClickPublish = () => {
		const { title, body, recipient, amount, token } = form.getValues();

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
				},
			},
		);
	};

	if (isLoading) {
		return <Button isDisabled={true}>Publishing</Button>;
	}

	if (isSuccess) {
		return (
			<Button onPress={() => console.log('success')}>
				View Proposal ({truncateAddress(newProposalId ?? '')})
			</Button>
		);
	}

	if (isError) {
		return <Button onPress={handleOnClickPublish}>Try Again</Button>;
	}

	return <Button onPress={handleOnClickPublish}>Publish</Button>;
};
