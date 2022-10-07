import moment from 'moment';

/**
 * Format seconds as humanized string
 * @param seconds to format
 * @param showSeconds bool value to show seconds in formatted string
 * @returns formatted humanized string
 */
export const secondsToDhms = (seconds: number, showSeconds = false): string => {
	let d = Math.floor(seconds / (3600 * 24));
	let h = Math.floor((seconds % (3600 * 24)) / 3600);
	let m = Math.floor((seconds % 3600) / 60);
	let s = Math.floor(seconds % 60);

	let dDisplay = d > 0 ? d + 'd ' : '';
	let hDisplay = h >= 0 ? h + 'h ' : '';
	let mDisplay = m >= 0 ? m + 'm ' : '';
	let sDisplay = showSeconds ? (s > 0 ? s + 's' : '') : '';

	return dDisplay + hDisplay + mDisplay + sDisplay;
};

/**
 * Format datetime
 * @param date to format
 * @param formatter formatter string
 * @returns formatted humanized string
 */
export const formatDateTime = (date: Date, formatter?: string): string => {
	if (!moment(date).isValid()) return '';

	return moment(date).format(formatter);
};
