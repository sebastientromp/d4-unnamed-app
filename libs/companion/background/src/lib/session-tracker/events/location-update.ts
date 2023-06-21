import { GameSession, GameSessionLocationOverview } from '../game-session.model';
import { GameSessionEvent, GameSessionEventName } from './_event';
import { GameSessionEventProcessor } from './_processor';
import { closeCurrentLocation } from './utils/location-utils';

export type LocationUpdateEventData = { locationId: string; currentGold: number | null };

export class LocationUpdateEvent implements GameSessionEvent {
	readonly eventName: GameSessionEventName = 'location-update';
	readonly data: LocationUpdateEventData;

	constructor(locationId: string, currentGold: number | null) {
		this.data = { locationId, currentGold };
	}
}

export class LocationUpdateEventProcessor implements GameSessionEventProcessor {
	public updateSession(sessionState: GameSession, data: LocationUpdateEventData): GameSession {
		if (!data.locationId) {
			console.debug('[session-tracker] no location found', data);
			return sessionState;
		}
		const gameSession = closeCurrentLocation(sessionState);
		const locationOverviews = [...gameSession.locationOverviews];
		let existingLocation: GameSessionLocationOverview | undefined = locationOverviews.find(
			(loc) => loc.location === data.locationId,
		);
		if (existingLocation == null) {
			existingLocation = {
				location: data.locationId,
				enterTimestamp: Date.now(),
				currentGold: data.currentGold,
				goldEarned: 0,
			};
			locationOverviews.push(existingLocation);
		}

		const currentLocation: GameSessionLocationOverview = {
			...existingLocation,
			enterTimestamp: Date.now(),
			exitTimestamp: undefined,
		};

		return {
			...gameSession,
			locationOverviews: locationOverviews.map((loc) =>
				loc.location === data.locationId ? currentLocation : loc,
			),
		};
	}
}
