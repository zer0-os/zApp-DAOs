import { create } from 'zustand';

export enum VoteStep {
	CONFIRM,
	WAITING_FOR_APPROVAL,
	CONFIRMING,
	SUCCESS,
	FAILED,
}

interface VoteStore {
	choice: string | undefined;
	setChoice: (choice: string) => void;
	step: VoteStep | undefined;
	setStep: (step: VoteStep) => void;
}

export const useVoteStore = create<VoteStore>((set) => ({
	choice: undefined,
	setChoice: (choice: string) => set({ choice }),
	step: VoteStep.CONFIRM,
	setStep: (step: VoteStep) => set({ step }),
}));
