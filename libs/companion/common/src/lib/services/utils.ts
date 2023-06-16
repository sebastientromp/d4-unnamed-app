export const sleep = (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export const pickRandom = <T>(array: readonly T[]): T | null => {
	if (!array?.length) {
		return null;
	}
	return array[Math.floor(Math.random() * array.length)];
};
