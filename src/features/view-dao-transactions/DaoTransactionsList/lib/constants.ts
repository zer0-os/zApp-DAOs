import { AssetType, TransactionType } from '@zero-tech/zdao-sdk';
import ethIcon from '../../../../assets/gnosis-eth.png';
import erc721Icon from '../../../../assets/erc721-default.svg';
import erc20Icon from '../../../../assets/erc20-default.svg';

export enum TRANSACTION_GROUPS {
	TODAY,
	LAST_WEEK,
	LAST_MONTH,
	EARLIER,
}

export const TRANSACTION_GROUP_LABELS: Record<TRANSACTION_GROUPS, string> = {
	[TRANSACTION_GROUPS.TODAY]: 'Today',
	[TRANSACTION_GROUPS.LAST_WEEK]: 'Last Week',
	[TRANSACTION_GROUPS.LAST_MONTH]: 'Last Month',
	[TRANSACTION_GROUPS.EARLIER]: 'Earlier',
};

export const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
export const WEEK_IN_MILLISECONDS = DAY_IN_MILLISECONDS * 7;
export const MONTH_IN_MILLISECONDS = DAY_IN_MILLISECONDS * 30;

export const TRANSACTION_IMAGE: Record<AssetType, string> = {
	[AssetType.NATIVE_TOKEN]: ethIcon,
	[AssetType.ERC721]: erc721Icon,
	[AssetType.ERC20]: erc20Icon,
};

export const TRANSACTION_TYPE: Record<TransactionType, string> = {
	[TransactionType.SENT]: 'Sent',
	[TransactionType.RECEIVED]: 'Received',
};

export const TRANSACTION_DIRECTION: Record<TransactionType, string> = {
	[TransactionType.SENT]: 'to',
	[TransactionType.RECEIVED]: 'from',
};
