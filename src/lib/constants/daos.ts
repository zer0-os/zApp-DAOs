// eslint-disable-next-line

import { CreateZDAOParams } from '@zero-tech/zdao-sdk';

export const HARDCODED_DAO: string | undefined = process.env.VITE_DAO_ZNA;

export const HARDCODED_PARAMS: Record<string, CreateZDAOParams> = {
	// @note: hiding wilder.dao because it doesn't have a safe address set up yet
	// 'wilder.dao': {
	// 	zNA: 'dao',
	// 	ens: 'wilderworlddao.eth',
	// 	title: 'Wilder World DAO',
	// 	safeAddress: '0xEf147697d948D609F712397Db270234CF155A925', // no treasury
	// 	votingToken: '0x2a3bff78b79a009976eea096a51a948a3dc00e34',
	// 	creator: '0x029105903125',
	// 	network: 1,
	// },
	'wilder.craft': {
		zNA: 'craft',
		ens: 'wildercraftdao.eth',
		title: 'Wilder Crafts DAO',
		safeAddress: '0x48c0E0C0A266255BE9E5E26C0aDc18991b893a86', // https://snapshot.org/#/wildercraftdao.eth/treasury
		votingToken: '0xe4954e4fb3c448f4efbc1f8ec40ed54a2a1cc1f5',
		creator: '0x029105903125',
		network: 1,
	},
	'wilder.cribs': {
		zNA: 'cribs',
		ens: 'wildercribsdao.eth',
		title: 'Wilder Cribs DAO',
		safeAddress: '0xcE2d2421ce6275b7A221F62eC5fA10A9c13E92f7', // https://snapshot.org/#/wildercribsdao.eth/treasury
		votingToken: '0xfea385b9e6e4fdfa3508ae6863d540c4a8ccc0fe',
		creator: '0x029105903125',
		network: 1,
	},
	'wilder.pals': {
		zNA: 'pals',
		ens: 'wilderpalsdao.eth',
		title: 'Wilder PALs DAO',
		safeAddress: '0x700F189E8756c60206E4D759272c0c2d57D9b343', // https://snapshot.org/#/wilderpalsdao.eth/treasury
		votingToken: '0x90a1f4B78Fa4198BB620b7686f510FD476Ec7A0B',
		creator: '0x029105903125',
		network: 1,
	},
};
