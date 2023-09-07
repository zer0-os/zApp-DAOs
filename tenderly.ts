import { exec as execProcess } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execProcess);

let devNetRpcUrl;

export const createDevNet = async (
	project: string,
	template: string,
	accountId: string,
	accessKey: string,
) => {
	// return from cache if already created
	if (devNetRpcUrl) {
		return devNetRpcUrl;
	}

	const command = `tenderly devnet spawn-rpc --project ${project} --template ${template} --account ${accountId} --access_key ${accessKey}`;

	const { stderr } = await exec(command);

	if (!stderr) {
		throw new Error('Failed to create devnet');
	}

	if (!isDevNetSpawnOutputValid(stderr)) {
		throw new Error('Failed to create devnet');
	}

	devNetRpcUrl = stderr.trim().toString();

	return devNetRpcUrl;
};

const isDevNetSpawnOutputValid = (output: string) => {
	let err;
	if (!output) {
		err = new Error('Failed to create devnet (no output)');
	}
	if (!output.includes('https://')) {
		err = new Error('Failed to create devnet (invalid output)');
	}

	if (err) {
		throw err;
	}

	return true;
};
