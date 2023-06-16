export interface SessionTrackerSection {
	readonly title: string;
	readonly goldEarned: number;
	// For sections where the user already went and left in the past, so data is complete
	readonly timeSpentInMillis: number;
	// The current section has an enterTimestamp, but no exitTimestamp
	readonly enterTimestamp?: number;
}
