import { getProposalStatus } from './helpers';
import { ProposalState } from '@zero-tech/zdao-sdk';

describe('getProposalStatus', () => {
	describe('when proposal is pending', () => {
		it('returns "Not Started" when proposal is pending', () => {
			const result = getProposalStatus(
				true,
				true,
				false,
				[1, 2],
				ProposalState.PENDING,
			);
			expect(result).toEqual('Not Started');
		});
	});

	describe('when proposal is not compatible', () => {
		it('returns "Closed" when proposal is closed', () => {
			const result = getProposalStatus(
				true,
				true,
				false,
				[1, 2],
				ProposalState.CLOSED,
			);
			expect(result).toEqual('Closed');
		});

		it('returns "Open" when proposal is active', () => {
			const result = getProposalStatus(
				true,
				true,
				false,
				[1, 2],
				ProposalState.ACTIVE,
			);
			expect(result).toEqual('Open');
		});

		it('returns "Pending" when proposal is pending', () => {
			const result = getProposalStatus(
				true,
				true,
				false,
				[1, 2],
				ProposalState.PENDING,
			);
			expect(result).toEqual('Pending');
		});
	});

	describe('when proposal is compatible', () => {
		it('returns "No Votes" when proposal is closed and has no votes', () => {
			const result = getProposalStatus(
				true,
				false,
				true,
				[1, 2],
				ProposalState.CLOSED,
			);
			expect(result).toEqual('No Votes');
		});

		it('returns "No Votes Yet" when proposal is active and has no votes', () => {
			const result = getProposalStatus(
				true,
				false,
				true,
				[1, 2],
				ProposalState.ACTIVE,
			);
			expect(result).toEqual('No Votes Yet');
		});

		it('returns "Expired" when proposal is closed and has no scores', () => {
			const result = getProposalStatus(
				true,
				true,
				true,
				[],
				ProposalState.CLOSED,
			);
			expect(result).toEqual('Expired');
		});

		it('returns "More Votes Needed" when proposal is active and has no scores', () => {
			const result = getProposalStatus(
				true,
				true,
				true,
				[],
				ProposalState.ACTIVE,
			);
			expect(result).toEqual('More Votes Needed');
		});

		it('returns "Approved" when proposal is closed, can be executed and has more votes in favor', () => {
			const result = getProposalStatus(
				true,
				true,
				true,
				[2, 1],
				ProposalState.CLOSED,
			);
			expect(result).toEqual('Approved');
		});

		it('returns "Denied" when proposal is closed, cannot be executed and has more votes against', () => {
			const result = getProposalStatus(
				false,
				true,
				true,
				[1, 2],
				ProposalState.CLOSED,
			);
			expect(result).toEqual('Denied');
		});

		it('returns "Approval Favoured" when proposal is active and has more votes in favor', () => {
			const result = getProposalStatus(
				true,
				true,
				true,
				[2, 1],
				ProposalState.ACTIVE,
			);
			expect(result).toEqual('Approval Favoured');
		});

		it('returns "Denial Favoured" when proposal is active and has more votes against', () => {
			const result = getProposalStatus(
				true,
				true,
				true,
				[1, 2],
				ProposalState.ACTIVE,
			);
			expect(result).toEqual('Denial Favoured');
		});

		it('returns "Denial Favoured" when proposal has equal votes for and against', () => {
			const result = getProposalStatus(
				true,
				true,
				true,
				[1, 1],
				ProposalState.ACTIVE,
			);
			expect(result).toEqual('Denial Favoured');
		});
	});
});
