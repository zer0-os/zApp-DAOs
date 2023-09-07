import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import {
	useDao,
	useDaoAssets,
	useUserPaymentTokenBalance,
	useWeb3,
} from '../../lib/hooks';
import { DAO_CREATE_PROPOSAL } from '../../pages/DAO';
import { AssetType } from '@zero-tech/zdao-sdk';

export const useCreateProposalContainerData = (zna: string) => {
	const history = useHistory();
	const { account } = useWeb3();

	const { data: dao } = useDao(zna);
	const { data: assets, isLoading: isLoadingAssets } = useDaoAssets(zna);

	const {
		isLoading: isLoadingPaymentTokenBalance,
		data: userPaymentTokenBalance,
	} = useUserPaymentTokenBalance(dao?.votingToken.token);

	const toAllProposals = history.location.pathname.replace(
		`/${DAO_CREATE_PROPOSAL}`,
		'',
	);

	const isDaoHoldingERC20Asset =
		Boolean(assets) &&
		assets.filter((asset) => asset.type === AssetType.ERC20).length > 0;

	const isUserHoldingVotingToken =
		userPaymentTokenBalance?.gt(0) &&
		Number(userPaymentTokenBalance) >= dao?.votingThreshold;

	const onBack = useCallback(() => {
		history.replace(toAllProposals);
	}, [history, toAllProposals]);

	const isLoading = isLoadingPaymentTokenBalance || isLoadingAssets;

	return {
		assets,
		onBack,
		isLoading,
		toAllProposals,
		isDaoHoldingERC20Asset,
		isUserHoldingVotingToken,
		isWalletConnected: account,
	};
};
