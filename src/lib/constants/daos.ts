// eslint-disable-next-line

import { CreateZDAOParams } from '@zero-tech/zdao-sdk';
import { Network } from './networks';

export const HARDCODED_DAO: string | undefined = process.env.VITE_DAO_ZNA;

export const HARDCODED_DAOS: Record<
	Network,
	Record<string, CreateZDAOParams>
> = {
	1: {
		'wilder.dao': {
			zNA: 'dao',
			ens: 'wilderworlddao.eth',
			title: 'Wilder World',
			safeAddress: '0xAf968D74e79fd2ad24e366bFf96E91F769e0AaEA', // https://snapshot.org/#/wilderworlddao.eth/treasury
			votingToken: '0x2a3bff78b79a009976eea096a51a948a3dc00e34',
			creator: '0x029105903125',
			network: 1,
		},
		'wilder.craft': {
			zNA: 'craft',
			ens: 'wildercraftdao.eth',
			title: 'Wilder Crafts',
			safeAddress: '0x48c0E0C0A266255BE9E5E26C0aDc18991b893a86', // https://snapshot.org/#/wildercraftdao.eth/treasury
			votingToken: '0xe4954e4fb3c448f4efbc1f8ec40ed54a2a1cc1f5',
			creator: '0x029105903125',
			network: 1,
		},
		'wilder.cribs': {
			zNA: 'cribs',
			ens: 'wildercribsdao.eth',
			title: 'Wilder Cribs',
			safeAddress: '0xcE2d2421ce6275b7A221F62eC5fA10A9c13E92f7', // https://snapshot.org/#/wildercribsdao.eth/treasury
			votingToken: '0xfea385b9e6e4fdfa3508ae6863d540c4a8ccc0fe',
			creator: '0x029105903125',
			network: 1,
		},
		'wilder.pals': {
			zNA: 'pals',
			ens: 'wilderpalsdao.eth',
			title: 'Wilder PALs',
			safeAddress: '0x700F189E8756c60206E4D759272c0c2d57D9b343', // https://snapshot.org/#/wilderpalsdao.eth/treasury
			votingToken: '0x90a1f4B78Fa4198BB620b7686f510FD476Ec7A0B',
			creator: '0x029105903125',
			network: 1,
		},
	},
	5: {
		'wilder.test': {
			zNA: 'sky',
			ens: 'zdao-sky.eth',
			title: 'Sky',
			safeAddress: '0x5109e87aeB1034380F1CA53F3fc20263b8d50521', // https://snapshot.org/#/wilderpalsdao.eth/treasury
			votingToken: '0x0e46c45f8aca3f89Ad06F4a20E2BED1A12e4658C', // mWILD
			creator: '0x029105903125',
			network: 5,
		},
		'wilder.721': {
			zNA: '721',
			ens: 'zdao721test.eth',
			title: '721 Test',
			safeAddress: '0x5109e87aeB1034380F1CA53F3fc20263b8d50521', // https://snapshot.org/#/wilderpalsdao.eth/treasury
			votingToken: '0x009A11617dF427319210e842D6B202f3831e0116',
			creator: '0x029105903125',
			network: 5,
		},
	},
};
