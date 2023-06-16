import { Injectable } from '@angular/core';
import { GameStatusService } from '@main-app/companion/common';
import { BehaviorSubject, distinctUntilChanged, filter } from 'rxjs';
import { EventsEmitterService } from '../events/events-emitter.service';
import { GameStateService } from '../game-state/game-state.service';
import { GameSession, GameSessionLocationEvent } from './game-session.model';

@Injectable()
export class SessionTrackerService {
	public gameSession$$ = new BehaviorSubject<GameSession>(this.initGameSession());

	constructor(
		private readonly eventsEmitter: EventsEmitterService,
		private readonly gameStatus: GameStatusService,
		private readonly gameState: GameStateService,
	) {}

	public async init(): Promise<void> {
		this.eventsEmitter.currentLocation$$
			.pipe(
				filter((currentLocation) => currentLocation != null),
				distinctUntilChanged(),
			)
			.subscribe((currentLocation) => {
				console.debug('[session-tracker] new location', currentLocation);
				let gameSession = this.closePreviousLocation(this.gameSession$$.value);
				const locationEvent: GameSessionLocationEvent = {
					location: currentLocation as string,
					enterTimestamp: Date.now(),
					currentGold: this.eventsEmitter.currentGold$$.value,
					goldEarned: 0,
				};
				gameSession = {
					...gameSession,
					locationEvents: [...gameSession.locationEvents, locationEvent],
				};
				this.gameSession$$.next(gameSession);
			});

		this.eventsEmitter.currentGold$$.pipe(filter((currentGold) => currentGold != null)).subscribe((currentGold) => {
			console.debug('[session-tracker] new gold', currentGold);
			let gameSession = this.gameSession$$.value;
			const location = gameSession.locationEvents[gameSession.locationEvents.length - 1];
			if (!location) {
				console.debug('[session-tracker] no location found for gold', currentGold);
				return;
			}

			let updatedLocation: GameSessionLocationEvent = {
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
				locationEvents: [
					...gameSession.locationEvents.slice(0, gameSession.locationEvents.length - 1),
					updatedLocation,
				],
			};
			this.gameSession$$.next(gameSession);
		});

		this.gameStatus.inGame$$.subscribe((inGame) => {
			if (!inGame) {
				const gameSession = this.closePreviousLocation(this.gameSession$$.value);
				this.gameSession$$.next(gameSession);
			}
		});
	}

	private closePreviousLocation(gameSession: GameSession): GameSession {
		if (!gameSession?.locationEvents?.length) {
			return gameSession;
		}

		const location = gameSession.locationEvents[gameSession.locationEvents.length - 1];
		const closeLocation = {
			...location,
			exitTimestamp: Date.now(),
		};
		return {
			...gameSession,
			locationEvents: [
				...gameSession.locationEvents.slice(0, gameSession.locationEvents.length - 1),
				closeLocation,
			],
		};
	}

	private computeGoldEarned(currentGold: number | null): number {
		const gameSession = this.gameSession$$.value;
		const location = gameSession.locationEvents[gameSession.locationEvents.length - 1];
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
			locationEvents: [],
		};
	}
}
