export interface GameSession {
	readonly startTime: number;
	readonly locationOverviews: readonly GameSessionLocationOverview[];
}

export interface GameSessionLocationOverview {
	readonly location: string;
	readonly locationName: string;
	readonly enterTimestamp: number;
	readonly exitTimestamp?: number;
	readonly totalTimeSpentInMillis?: number;
	readonly currentGold: number | null;
	readonly goldEarned: number;
}
