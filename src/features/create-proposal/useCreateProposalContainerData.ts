import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import {
	useDaoAssets,
	useUserPaymentTokenBalance,
	useWeb3
} from '../../lib/hooks';
import { DAO_CREATE_PROPOSAL } from '../../pages/DAO/DAO.constants';
import { AssetType, zDAO } from '@zero-tech/zdao-sdk';

export const useCreateProposalContainerData = (
	isLoadingDao: boolean,
	dao: zDAO
) => {
	const history = useHistory();

	const { account } = useWeb3();
	const { data: assets, isLoading: isLoadingAssets } = useDaoAssets(dao);
	const {
		isLoading: isLoadingPaymentTokenBalance,
		data: userPaymentTokenBalance
	} = useUserPaymentTokenBalance(dao?.votingToken.token);

	const isLoading =
		isLoadingDao || isLoadingPaymentTokenBalance || isLoadingAssets;

	const toAllProposals = history.location.pathname.replace(
		`/${DAO_CREATE_PROPOSAL}`,
		''
	);

	const isDaoHoldingERC20Asset =
		Boolean(assets) &&
		assets.filter((asset) => asset.type === AssetType.ERC20).length > 0;

	const isUserHoldingVotingToken = userPaymentTokenBalance?.gt(0);

	const onBack = useCallback(() => {
		history.replace(toAllProposals);
	}, [history, toAllProposals]);

	return {
		assets,
		onBack,
		isLoading,
		toAllProposals,
		isDaoHoldingERC20Asset,
		isUserHoldingVotingToken,
		isWalletConnected: account
	};
};
