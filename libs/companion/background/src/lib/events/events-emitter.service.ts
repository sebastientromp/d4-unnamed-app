import { Injectable } from '@angular/core';
import { OverwolfService } from '@main-app/companion/common';
import { BehaviorSubject } from 'rxjs';
import { MockEventsService } from './mock-events.service';

@Injectable()
export class EventsEmitterService {
	public inMatch$$ = new BehaviorSubject<boolean>(true);
	public currentGold$$ = new BehaviorSubject<number | null>(null);

	constructor(private readonly ow: OverwolfService, private readonly mockEvents: MockEventsService) {}

	public async init(): Promise<void> {
		console.log('init events emitter service');
		overwolf.games.events.onNewEvents.addListener((events) => {
			for (const event of events.events) {
				this.processNewGepEvent(event);
			}
		});
		overwolf.games.events.onInfoUpdates2.addListener((event) => {
			this.processNewGepInfoUpdates(event);
		});
		overwolf.games.events.getInfo((event) => {
			this.processGepGameInfo(event);
		});
		await this.ow.setRequiredFeatures(['match_info', 'location']);

		this.mockEvents.events$$.subscribe((events) => {
			for (const event of events) {
				this.processNewGepEvent(event);
			}
		});
	}

	private processNewGepEvent(event: overwolf.games.events.GameEvent) {
		console.debug('[events-emitter] received event', event);
		switch (event.name) {
			case 'match_start':
				this.inMatch$$.next(true);
				break;
			case 'match_end':
				this.inMatch$$.next(false);
				break;
			case 'current_gold':
				this.currentGold$$.next(parseInt(event.data));
				break;
		}
	}

	private processNewGepInfoUpdates(event: any) {
		console.debug('[events-emitter] received info update', event);
	}

	private processGepGameInfo(event: any) {
		console.debug('[events-emitter] received info', event);
	}
}
