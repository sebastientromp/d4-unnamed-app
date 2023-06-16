export interface GameSession {
	readonly startTime: number;
	readonly locationEvents: readonly GameSessionLocationEvent[];
}

export interface GameSessionLocationEvent {
	readonly location: string;
	readonly enterTimestamp: number;
	readonly exitTimestamp?: number;
	readonly currentGold: number | null;
	readonly goldEarned: number;
}
