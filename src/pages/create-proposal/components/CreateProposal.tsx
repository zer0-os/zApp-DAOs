import React, { ReactNode } from 'react';

import { AssetType } from '@zero-tech/zdao-sdk';
import { useUserVotePower } from 'features/vote-on-proposal/lib/useUserVotePower';
import { useCurrentDao, useDaoAssetsCoins, useWeb3 } from 'lib/hooks';

import { IconLinkExternal1 } from '@zero-tech/zui/icons';
import { Button } from '@zero-tech/zui/components/Button';
import { LoadingIndicator } from '@zero-tech/zui/components';
import { CreateProposalForm } from 'features/create-proposal';
import { AllProposalsLink } from 'pages/proposal/components/AllProposalsLink';

import styles from './CreateProposal.module.scss';
import classNames from 'classnames';

/////////////////////
// Create Proposal //
/////////////////////

export const CreateProposal = () => {
	return (
		<div className={styles.Create}>
			<AllProposalsLink />
			<h1>Create a Proposal</h1>
			<Body />
		</div>
	);
};

//////////
// Body //
//////////

const Body = () => {
	const { account, connectWallet } = useWeb3();
	const { dao, zna, isLoading: isLoadingDao } = useCurrentDao();
	const { data: daoCoins, isLoading: isLoadingAssets } = useDaoAssetsCoins(zna);
	const { data: userVotePower, isLoading: isLoadingVotePower } =
		useUserVotePower();

	const isLoading = isLoadingDao || isLoadingAssets || isLoadingVotePower;

	const isHoldingErc20 = daoCoins?.coins.some(
		(coin) => coin.type === AssetType.ERC20,
	);

	if (isLoading) {
		return (
			<Message className={styles.Loading}>
				<LoadingIndicator spinnerPosition={'left'} text={'Loading DAO'} />
			</Message>
		);
	}

	if (!dao) {
		return <Message>Failed to find DAO.</Message>;
	}

	if (!isHoldingErc20) {
		return (
			<Message className={styles.ERC20}>
				<p>
					You cannot create a funding proposal as this DAO treasury does not
					hold any tokens to request.
				</p>
				<p>
					Proposals are currently limited to funding proposals (where DAO ERC20
					tokens are sent to a recipient, if the proposal is approved). Please
					check the assets tab of the DAO.
				</p>
			</Message>
		);
	}

	if (!account) {
		return (
			<Message>
				Please connect a Web3 wallet to create a proposal{' '}
				<Button onPress={connectWallet}>Connect Wallet</Button>
			</Message>
		);
	}

	// if (userVotePower?.lte(0)) {
	// 	return (
	// 		<Message className={styles.Token}>
	// 			<span>
	// 				You must be holding the DAO voting token{' '}
	// 				<b>({dao.votingToken.symbol})</b> in order to create a proposal.
	// 			</span>
	// 			{dao.votingToken.decimals > 0 && (
	// 				<a
	// 					href={
	// 						'https://app.uniswap.org/swap?theme=dark&outputCurrency=' +
	// 						dao.votingToken.token
	// 					}
	// 					target={'_blank'}
	// 					rel={'noreferrer'}
	// 				>
	// 					Purchase {dao.votingToken.symbol} on Uniswap{' '}
	// 					<IconLinkExternal1 isFilled={true} size={16} />
	// 				</a>
	// 			)}
	// 		</Message>
	// 	);
	// }

	return <CreateProposalForm />;
};

/////////////
// Message //
/////////////

interface MessageProps {
	children: ReactNode;
	className?: string;
}

const Message = ({ children, className }: MessageProps) => {
	return (
		<div className={classNames(styles.Message, className)}>{children}</div>
	);
};
