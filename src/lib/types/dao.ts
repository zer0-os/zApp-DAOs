import type { AssetType, Coin, Collectible } from '@zero-tech/zdao-sdk';

export interface WrappedCollectible extends Collectible {
	type: AssetType;
}

export type Asset = Coin | WrappedCollectible;
