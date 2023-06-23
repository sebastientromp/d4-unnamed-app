import { GameSession, GameSessionLocationOverview } from '../../game-session.model';

export const closeCurrentLocation = (gameSession: GameSession): GameSession => {
	if (!gameSession?.locationOverviews?.length) {
		return gameSession;
	}

	const location = getCurrentLocation(gameSession);
	if (!location) {
		return gameSession;
	}
	const closeLocation = {
		...location,
		totalTimeSpentInMillis: (location.totalTimeSpentInMillis ?? 0) + (Date.now() - location.enterTimestamp),
		exitTimestamp: Date.now(),
	};
	return {
		...gameSession,
		locationOverviews: gameSession.locationOverviews.map((loc) =>
			loc.location === closeLocation.location ? closeLocation : loc,
		),
	};
};

export const getCurrentLocation = (gameSession: GameSession): GameSessionLocationOverview | undefined => {
	return gameSession.locationOverviews.find((l) => l.exitTimestamp == null);
};
