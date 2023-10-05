import React from 'react';

import { TransferWithTokenInfoResponse } from '@safe-global/api-kit/dist/src/types/safeTransactionServiceTypes';
import { formatUnits } from 'ethers/lib/utils';
import { truncateAddress } from '@zero-tech/zui/utils';

import { IconArrowDownLeft, IconLinkExternal1 } from '@zero-tech/zui/icons';

import styles from './TransactionList.module.scss';

export interface TransferItemProps {
	transfer: TransferWithTokenInfoResponse;
	safeAddress: string;
	etherscanUri: string;
}

export const TransferItem = ({
	transfer,
	safeAddress,
	etherscanUri,
}: TransferItemProps) => {
	const isIncoming = transfer.to === safeAddress;

	let tokenSymbol: string = 'ETH';
	if (transfer.tokenInfo?.symbol) {
		if (transfer.tokenInfo?.symbol === 'ZERO') {
			tokenSymbol = 'MEOW';
		} else {
			tokenSymbol = transfer.tokenInfo?.symbol;
		}
	}

	return (
		<div
			className={styles.Transfer}
			data-direction={isIncoming ? 'incoming' : 'outgoing'}
		>
			<div>
				<IconArrowDownLeft size={16} className={styles.ArrowIcon} isFilled />
				<span>
					{isIncoming ? 'Received' : 'Sent'}{' '}
					<b>
						{transfer.value
							? Number(
									formatUnits(
										transfer.value,
										transfer.tokenInfo?.decimals ?? 18,
									),
							  ).toLocaleString()
							: 1}{' '}
						{tokenSymbol}
					</b>{' '}
					{isIncoming ? 'from' : 'to'}{' '}
					<b>
						<a
							href={
								etherscanUri +
								'address/' +
								(isIncoming ? transfer.from : transfer.to)
							}
							target={'_blank'}
							rel={'noreferrer'}
						>
							{isIncoming
								? truncateAddress(transfer.from)
								: truncateAddress(transfer.to)}
						</a>
					</b>
				</span>
			</div>
			<div>
				{new Date(transfer.executionDate).toLocaleDateString()}{' '}
				<a
					href={etherscanUri + '/tx/' + transfer.transactionHash}
					target={'_blank'}
					rel={'noreferrer'}
				>
					<IconLinkExternal1 isFilled={true} size={16} />
				</a>
			</div>
		</div>
	);
};
