import * as z from 'zod';

export const schema = z.object({
	title: z.string().min(1, { message: 'Proposal title is required' }),
	token: z
		.string()
		.min(1, { message: 'Token is required' })
		.regex(/^0x[a-fA-F0-9]{40}$/, {
			message: 'Must be a valid Ethereum address',
		}),
	amount: z.preprocess(
		(a) => parseFloat((a as string) ?? '0'),
		z.number().positive().gt(0),
	),
	body: z.string().min(1, { message: 'Proposal body is required' }).max(10000, {
		message: 'Proposal body can not be longer than 10,000 characters',
	}),
	recipient: z
		.string()
		.min(1, { message: 'Recipient is required' })
		.regex(/^0x[a-fA-F0-9]{40}$/, {
			message: 'Must be a valid Ethereum address',
		}),
});
