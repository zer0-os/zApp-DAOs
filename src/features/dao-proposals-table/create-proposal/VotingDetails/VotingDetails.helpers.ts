import type { VotingDetailItem } from './VotingDetails.types';

import moment from 'moment';
import { formatDateTime } from '../../../../lib/util/datetime';
import { DEFAULT_VOTE_DURATION_DAYS } from '../CreateProposal.constants';

export const getVotingDetails = (): VotingDetailItem[] => {
	const voteDuration: VotingDetailItem = {
		label: 'Vote Duration',
		value: DEFAULT_VOTE_DURATION_DAYS + ' days'
	};
	const votingEnds: VotingDetailItem = {
		label: 'Voting Ends',
		value: formatDateTime(
			moment().add(DEFAULT_VOTE_DURATION_DAYS, 'days').toDate(),
			'M/D/YYYY h:mm A Z'
		)
	};
	const votingSystem: VotingDetailItem = {
		label: 'Voting System',
		value: 'Weighted Single Choice'
	};
	const executionCriteria: VotingDetailItem = {
		label: 'Execution Criteria',
		value: 'Absolute Majority (<50%)'
	};

	return [voteDuration, votingEnds, votingSystem, executionCriteria];
};
