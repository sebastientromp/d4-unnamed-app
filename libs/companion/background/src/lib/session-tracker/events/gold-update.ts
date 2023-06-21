import { GameSession } from '../game-session.model';
import { GameSessionEvent, GameSessionEventName } from './_event';
import { GameSessionEventProcessor } from './_processor';
import { getCurrentLocation } from './utils/location-utils';

type EventData = { currentGold: number | null };

export class GoldUpdateEvent implements GameSessionEvent {
	readonly eventName: GameSessionEventName = 'gold-update';
	readonly data: EventData;

	constructor(currentGold: number | null) {
		this.data = { currentGold };
	}
}

export class GoldUpdateEventProcessor implements GameSessionEventProcessor {
	public updateSession(sessionState: GameSession, data: EventData): GameSession {
		console.debug('[session-tracker] new gold', data.currentGold);
		const location = getCurrentLocation(sessionState);
		if (!location) {
			console.debug('[session-tracker] no location found for gold', data.currentGold);
			return sessionState;
		}

		const goldEarned = computeGoldEarned(sessionState, data.currentGold);
		const updatedLocation = {
			...location,
			currentGold: data.currentGold,
			goldEarned: location.goldEarned + Math.max(goldEarned, 0),
		};
		return {
			...sessionState,
			locationOverviews: sessionState.locationOverviews.map((loc) =>
				loc.location === updatedLocation.location ? updatedLocation : loc,
			),
		};
	}
}

const computeGoldEarned = (gameSession: GameSession, currentGold: number | null): number => {
	const location = getCurrentLocation(gameSession);
	if (!location) {
		console.debug('[session-tracker] no location found for gold', currentGold);
		return 0;
	}
	const previousGold = location.currentGold;
	if (previousGold == null || currentGold == null) {
		return 0;
	}
	return currentGold - previousGold;
};
