import * as z from 'zod';

export const schema = z.object({
	title: z.string().min(1, { message: 'Required' }),
	token: z
		.string()
		.min(1, { message: 'Required' })
		.regex(/^0x[a-fA-F0-9]{40}$/, {
			message: 'Must be a valid Ethereum address',
		}),
	amount: z.preprocess(
		(a) => parseFloat((a as string) ?? '0'),
		z.number().positive().gt(0),
	),
	body: z.string().min(1, { message: 'Required' }),
	recipient: z
		.string()
		.min(1, { message: 'Required' })
		.regex(/^0x[a-fA-F0-9]{40}$/, {
			message: 'Must be a valid Ethereum address',
		}),
});
