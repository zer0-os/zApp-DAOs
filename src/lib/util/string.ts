/**
 * Truncate string
 * @param str to truncate
 * @param len length to truncate
 * @param tail tail to truncate
 * @returns truncated string
 */
export const truncateString = (str: string, len: number, tail = '...') =>
	str.length > len
		? str.slice(0, len > tail.length ? len - tail.length : len) + tail
		: str;

/**
 * Check if string contains sub string
 * @param str string to check
 * @param sub substring
 * @returns true if sstr contains the sub string, otherwise false
 */
export const containsSubstring = (str: string, sub: string): boolean =>
	str.toLowerCase().includes(sub.toLowerCase());
