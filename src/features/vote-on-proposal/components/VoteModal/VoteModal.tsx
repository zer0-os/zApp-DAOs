import { useCurrentProposal } from 'pages/proposal/lib/useCurrentProposal';
import { useWeb3 } from 'lib/hooks';
import ProposalClient from '@zero-tech/zdao-sdk/lib/client/ProposalClient';
import { truncateAddress } from '@zero-tech/zui/utils';
import { useUserVotePower } from '../../lib/useUserVotePower';
import { useVoteStore, VoteStep } from '../../lib/store';
import { useQueryClient } from 'react-query';

import {
	Alert,
	Button,
	MaybeSkeletonText,
	Wizard,
} from '@zero-tech/zui/components';
import { Modal } from 'features/ui/Modal';

import styles from './VoteModal.module.scss';

export const VoteModal = () => {
	const choice = useVoteStore((state) => state.choice);
	const setChoice = useVoteStore((state) => state.setChoice);

	return (
		<Modal
			open={choice !== undefined}
			onOpenChange={() => setChoice(undefined)}
			className={styles.Modal}
		>
			<Form />
		</Modal>
	);
};

const Form = () => {
	const choice = useVoteStore((state) => state.choice);
	const step = useVoteStore((state) => state.step);

	return (
		<Wizard.Container header={'Confirm vote'} className={styles.Vote}>
			{step === VoteStep.CONFIRM && (
				<p>
					Are you sure you want to vote for <b>{choice}</b>? This will be
					processed by the blockchain and cannot be reversed.
				</p>
			)}
			<Details />
			{step === VoteStep.WAITING_FOR_APPROVAL && (
				<p>Please sign transaction in your wallet</p>
			)}
			{step === VoteStep.SUCCESS && (
				<Alert variant="success">
                Vote submitted successfully!
				</Alert>
			)}
			{step === VoteStep.CONFIRMING && (
				<p>
					Your vote is being written to the blockchain, this may take up to 20
					minutes. Please wait...
				</p>
			)}
			{step === VoteStep.FAILED && (
				<p className={styles.Error}>Failed to submit vote.</p>
			)}
			<Actions />
		</Wizard.Container>
	);
};

const Details = () => {
	const { data: proposal } = useCurrentProposal();
	const { data: userVotePower, isLoading: isLoadingUserVotePower } =
		useUserVotePower();
	const { account } = useWeb3();

	const choice = useVoteStore((state) => state.choice);

	const tokenSymbol = (proposal as ProposalClient)?.['options']?.strategies?.[0]
		?.params?.symbol;

	return (
		<ul>
			<li>
				<label>Your address</label>
				<span>{truncateAddress(account)}</span>
			</li>
			<li>
				<label>Your vote</label>
				<span>{choice}</span>
			</li>
			<li>
				<label>Your voting power</label>
				<MaybeSkeletonText
					text={{
						text: `${userVotePower.toString()} ${tokenSymbol}`,
						isLoading: isLoadingUserVotePower,
					}}
				/>
			</li>
		</ul>
	);
};

const Actions = () => {
	const { data: proposal } = useCurrentProposal();
	const { account, provider } = useWeb3();

	const queryClient = useQueryClient();

	const choice = useVoteStore((state) => state.choice);
	const setChoice = useVoteStore((state) => state.setChoice);
	const setStep = useVoteStore((state) => state.setStep);
	const step = useVoteStore((state) => state.step);

	const handleOnSuccess = () => {
		setStep(VoteStep.SUCCESS);
	};

	const handleOnConfirm = async () => {
		setStep(VoteStep.WAITING_FOR_APPROVAL);
		try {
			await proposal.vote(
				provider,
				account,
				proposal.choices.indexOf(choice) + 1,
			);
			await queryClient.invalidateQueries([
				'dao',
				'proposal',
				'votes',
				{ proposalId: proposal.id },
			]);
			handleOnSuccess();
		} catch (e) {
			setStep(VoteStep.FAILED);
		}
	};

	return (
		<div className={styles.Actions}>
			<Button variant={'text'} onPress={() => setChoice(undefined)}>
				Cancel
			</Button>
			{step === VoteStep.CONFIRM && (
				<Button onPress={handleOnConfirm}>Confirm</Button>
			)}
			{step === VoteStep.FAILED && (
				<Button onPress={handleOnConfirm}>Try Again</Button>
			)}
			{step === VoteStep.WAITING_FOR_APPROVAL && (
				<Button isDisabled={true}>Waiting For Approval</Button>
			)}
		</div>
	);
};
