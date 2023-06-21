export interface GameSessionEvent {
	readonly eventName: GameSessionEventName;
	readonly data?: any;
}

export type GameSessionEventName =
	| 'start-session'
	| 'end-session'
	| 'reset-session'
	| 'location-update'
	| 'gold-update';
