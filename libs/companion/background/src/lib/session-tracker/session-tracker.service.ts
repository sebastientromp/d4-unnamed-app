import { Injectable } from '@angular/core';
import { GameStatusService } from '@main-app/companion/common';
import { BehaviorSubject, filter } from 'rxjs';
import { AppStoreService } from '../events/app-store/app-store.service';
import { EventsEmitterService } from '../events/events-emitter.service';
import { GameSessionEvent, GameSessionEventName } from './events/_event';
import { GameSessionEventProcessor } from './events/_processor';
import { EndSessionEvent, EndSessionEventProcessor } from './events/end-session';
import { GoldUpdateEvent, GoldUpdateEventProcessor } from './events/gold-update';
import { LocationUpdateEvent, LocationUpdateEventProcessor } from './events/location-update';
import { ResetSessionEvent, ResetSessionEventProcessor } from './events/reset-session';
import { StartSessionEvent, StartSessionEventProcessor } from './events/start-session';
import { GameSession } from './game-session.model';

@Injectable()
export class SessionTrackerService {
	public gameSession$$ = new BehaviorSubject<GameSession>(buildInitialGameSession());

	private eventQueue$$ = new BehaviorSubject<GameSessionEvent | null>(null);
	private eventProcessors: { [eventName in GameSessionEventName]: GameSessionEventProcessor } = {
		'start-session': new StartSessionEventProcessor(),
		'end-session': new EndSessionEventProcessor(),
		'reset-session': new ResetSessionEventProcessor(),
		'location-update': new LocationUpdateEventProcessor(),
		'gold-update': new GoldUpdateEventProcessor(),
	};

	constructor(
		private readonly eventsEmitter: EventsEmitterService,
		private readonly gameStatus: GameStatusService,
		private readonly appStore: AppStoreService,
	) {}

	public async init(): Promise<void> {
		this.eventQueue$$.subscribe((event) => {
			console.debug('[session tracker] processing event', event);
			if (event == null) {
				return;
			}
			const processor = this.eventProcessors[event.eventName];
			const updatedSession = processor.updateSession(this.gameSession$$.value, event.data);
			this.gameSession$$.next(updatedSession);
			console.debug('[session tracker] after processing event', this.gameSession$$.value);
		});

		this.gameStatus.inGame$$.subscribe((inGame) => {
			if (!inGame) {
				console.debug('[session tracker] game ended');
				this.eventQueue$$.next(new EndSessionEvent());
			}
		});
		this.eventsEmitter.inMatch$$.subscribe((inMatch) => {
			if (inMatch === false) {
				console.debug('[session tracker] match ended');
				this.eventQueue$$.next(new EndSessionEvent());
			} else {
				this.eventQueue$$.next(new StartSessionEvent());
			}
		});
		this.appStore.eventsQueue$$.pipe(filter((e) => e?.eventName === 'reset-session')).subscribe((resetEvent) => {
			this.eventQueue$$.next(new ResetSessionEvent());
		});
		this.initEventsListeners();
	}

	private initEventsListeners(): void {
		this.eventsEmitter.currentLocation$$
			.pipe(filter((currentLocation) => currentLocation != null))
			.subscribe((gepLocId) => {
				// console.debug('[session-tracker] new location', gepLocId);
				const locationId: string = this.toLocationId(gepLocId);
				this.eventQueue$$.next(new LocationUpdateEvent(locationId, this.eventsEmitter.currentGold$$.value));
			});

		this.eventsEmitter.currentGold$$.pipe(filter((currentGold) => currentGold != null)).subscribe((currentGold) => {
			this.eventQueue$$.next(new GoldUpdateEvent(currentGold));
		});
	}

	private toLocationId(gepLocId: string | null): string {
		return gepLocId as string;
	}
}

export const buildInitialGameSession = (): GameSession => {
	return {
		startTime: Date.now(),
		locationOverviews: [],
	};
};
