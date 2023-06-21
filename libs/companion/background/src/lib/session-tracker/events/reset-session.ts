import { GameSession } from '../game-session.model';
import { buildInitialGameSession } from '../session-tracker.service';
import { GameSessionEvent, GameSessionEventName } from './_event';
import { GameSessionEventProcessor } from './_processor';
import { getCurrentLocation } from './utils/location-utils';

export class ResetSessionEvent implements GameSessionEvent {
	readonly eventName: GameSessionEventName = 'reset-session';
}

export class ResetSessionEventProcessor implements GameSessionEventProcessor {
	public updateSession(sessionState: GameSession): GameSession {
		const currentLocation = getCurrentLocation(sessionState);
		if (currentLocation == null) {
			console.warn('[session-tracker][reset-session] Could not find current location');
			return sessionState;
		}
		const newSession: GameSession = {
			...buildInitialGameSession(),
			locationOverviews: [
				{
					enterTimestamp: Date.now(),
					totalTimeSpentInMillis: undefined,
					location: currentLocation.location,
					currentGold: currentLocation.currentGold,
					goldEarned: 0,
				},
			],
		};
		return newSession;
	}
}
