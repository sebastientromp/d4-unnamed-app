import { GameSession, GameSessionLocationOverview } from '../game-session.model';
import { GameSessionEvent, GameSessionEventName } from './_event';
import { GameSessionEventProcessor } from './_processor';
import { closeCurrentLocation } from './utils/location-utils';

import territories from '../../data/territories.json';
import { LevelArea, SubZone, Territory } from '../../data/territory.type';

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
		console.debug('{session-tracker] after closing location', gameSession);
		const locationOverviews = [...gameSession.locationOverviews];
		let existingLocation: GameSessionLocationOverview | undefined = locationOverviews.find(
			(loc) => loc.location === data.locationId,
		);
		console.debug('[session-tracker] existing location', existingLocation);
		if (existingLocation == null) {
			existingLocation = {
				location: data.locationId,
				locationName: getName(data.locationId),
				enterTimestamp: Date.now(),
				currentGold: data.currentGold,
				goldEarned: 0,
			};
			locationOverviews.push(existingLocation);
		}
		console.debug('[session-tracker] updated location', existingLocation, locationOverviews);

		const currentLocation: GameSessionLocationOverview = {
			...existingLocation,
			enterTimestamp: Date.now(),
			exitTimestamp: undefined,
		};
		console.debug('[session-tracker] updated current location', currentLocation);

		const result = {
			...gameSession,
			locationOverviews: locationOverviews.map((loc) =>
				loc.location === currentLocation.location ? currentLocation : loc,
			),
		};
		console.debug('[session-tracker] updated session', result);
		return result;
	}
}

export const getName = (locationId: string): string => {
	return territories.map((t) => findLocationInTerritory(t, locationId)).find((l) => !!l)?.text ?? locationId;
};

const findLocationInTerritory = (territory: Territory, locationId: string): LevelArea | undefined => {
	return territory.subZones.map((s) => findLocationInSubZone(s, locationId)).find((l) => !!l);
};

const findLocationInSubZone = (subZone: SubZone, locationId: string): LevelArea | undefined => {
	return subZone.levelAreas.find((l) => l.value === +locationId);
};
