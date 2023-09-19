import { format } from 'date-fns';

/**
 * Format seconds as humanized string
 * @param seconds to format
 * @param showSeconds bool value to show seconds in formatted string
 * @returns formatted humanized string
 */
export const secondsToDhms = (seconds: number, showSeconds = false): string => {
	const d = Math.floor(seconds / (3600 * 24));
	const h = Math.floor((seconds % (3600 * 24)) / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = Math.floor(seconds % 60);

	const dDisplay = d > 0 ? d + 'd ' : '';
	const hDisplay = h >= 0 ? h + 'h ' : '';
	const mDisplay = m >= 0 ? m + 'm ' : '';
	const sDisplay = showSeconds ? (s > 0 ? s + 's' : '') : '';

	return dDisplay + hDisplay + mDisplay + sDisplay;
};

/**
 * Format datetime
 * @param date to format
 * @param formatter formatter string
 * @returns formatted humanized string
 */
export const formatDateTime = (date: Date): string => {
	return format(date, 'do MMM yy (h:mm a)');
};
