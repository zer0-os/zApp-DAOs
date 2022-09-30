export enum Step {
	Confirm,
	Publishing,
	Success,
}

export const PUBLISH_MODAL_HEADER: Record<Step, string> = {
	[Step.Confirm]: 'Publish Proposal?',
	[Step.Publishing]: 'Publish Proposal?',
	[Step.Success]: 'Success!'
};

export const PUBLISH_MODAL_BODY: Record<Step, string> = {
	[Step.Confirm]:
		'Once your proposal is published it will be visible to the world and you will not be able to make any changes.',
	[Step.Publishing]: 'Please sign in your wallet to publish proposal...',
	[Step.Success]: 'Your proposal is live.'
};
