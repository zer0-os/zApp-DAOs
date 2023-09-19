export const kebabCaseToTitleCase = (str: string) => {
	return str.replace(/-/, ' ').replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
};
