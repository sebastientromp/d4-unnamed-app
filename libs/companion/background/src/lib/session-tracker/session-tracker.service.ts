import { Injectable } from '@angular/core';
import { GameStatusService } from '@main-app/companion/common';
import { BehaviorSubject, distinctUntilChanged, filter } from 'rxjs';
import { EventsEmitterService } from '../events/events-emitter.service';
import { GameSession, GameSessionLocationOverview } from './game-session.model';

@Injectable()
export class SessionTrackerService {
	public gameSession$$ = new BehaviorSubject<GameSession>(this.initGameSession());

	constructor(
		private readonly eventsEmitter: EventsEmitterService,
		private readonly gameStatus: GameStatusService,
	) {}

	public async init(): Promise<void> {
		this.initEventsListeners();
		this.gameStatus.inGame$$.subscribe((inGame) => {
			if (inGame) {
				this.gameSession$$.next(this.initGameSession());
			} else {
				this.closeGameSession();
			}
		})
	}

	private closeGameSession() {
		// add the exitTimestamp of the last lcation
		// check for data integrity
		// save the value in the local storage
		// + put in place a page on the main window to check the stats
	}

	private initEventsListeners(): void {
		this.eventsEmitter.currentLocation$$
			.pipe(
				filter((currentLocation) => currentLocation != null),
				distinctUntilChanged(),
			)
			.subscribe((gepLocId) => {
				console.debug('[session-tracker] new location', gepLocId);
				const locationId: string = this.toLocationId(gepLocId);
				let gameSession = this.closeCurrentLocation(this.gameSession$$.value);
				const existingLocation: GameSessionLocationOverview = gameSession.locationOverviews.find(
					(loc) => loc.location === locationId,
				) ?? {
					location: locationId,
					enterTimestamp: Date.now(),
					currentGold: this.eventsEmitter.currentGold$$.value,
					goldEarned: 0,
				};
				const currentLocation: GameSessionLocationOverview = {
					...existingLocation,
					enterTimestamp: Date.now(),
					exitTimestamp: undefined,
				};

				gameSession = {
					...gameSession,
					locationOverviews: gameSession.locationOverviews.map((loc) =>
						loc.location === locationId ? currentLocation : loc,
					),
				};
				this.gameSession$$.next(gameSession);
			});

		this.eventsEmitter.currentGold$$.pipe(filter((currentGold) => currentGold != null)).subscribe((currentGold) => {
			console.debug('[session-tracker] new gold', currentGold);
			let gameSession = this.gameSession$$.value;
			const location = gameSession.locationOverviews[gameSession.locationOverviews.length - 1];
			if (!location) {
				console.debug('[session-tracker] no location found for gold', currentGold);
				return;
			}

			let updatedLocation: GameSessionLocationOverview = {
				...location,
				currentGold: currentGold,
			};
			const goldEarned = this.computeGoldEarned(currentGold);
			if (goldEarned <= 0) {
				return;
			}

			updatedLocation = {
				...updatedLocation,
				goldEarned: goldEarned,
			};
			gameSession = {
				...gameSession,
				locationOverviews: [
					...gameSession.locationOverviews.slice(0, gameSession.locationOverviews.length - 1),
					updatedLocation,
				],
			};
			this.gameSession$$.next(gameSession);
		});

		this.gameStatus.inGame$$.subscribe((inGame) => {
			if (!inGame) {
				const gameSession = this.closeCurrentLocation(this.gameSession$$.value);
				this.gameSession$$.next(gameSession);
			}
		});
	}
	
	private toLocationId(gepLocId: string | null): string {
		return gepLocId as string;
	}

	private closeCurrentLocation(gameSession: GameSession): GameSession {
		if (!gameSession?.locationOverviews?.length) {
			return gameSession;
		}

		const location = gameSession.locationOverviews.find((l) => l.exitTimestamp == null);
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
			locationOverviews: [
				...gameSession.locationOverviews.slice(0, gameSession.locationOverviews.length - 1),
				closeLocation,
			],
		};
	}

	private computeGoldEarned(currentGold: number | null): number {
		const gameSession = this.gameSession$$.value;
		const location = gameSession.locationOverviews[gameSession.locationOverviews.length - 1];
		if (!location) {
			console.debug('[session-tracker] no location found for gold', currentGold);
			return 0;
		}
		const previousGold = location.currentGold;
		if (previousGold == null || currentGold == null) {
			return 0;
		}
		return currentGold - previousGold;
	}

	private initGameSession(): GameSession {
		return {
			startTime: Date.now(),
			locationOverviews: [],
		};
	}
}
