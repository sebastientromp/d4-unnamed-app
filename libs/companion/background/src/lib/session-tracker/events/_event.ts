export interface GameSessionEvent {
	readonly eventName: GameSessionEventName;
	readonly data?: any;
}

export type GameSessionEventName = 'start-session' | 'end-session' | 'location-update' | 'gold-update';
