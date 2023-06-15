import { Injectable } from '@angular/core';
import { OverwolfService } from '@main-app/companion/common';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class EventsEmitterService {
	public inMatch$$ = new BehaviorSubject<boolean>(false);

	constructor(private readonly ow: OverwolfService) {}

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
		}
	}

	private processNewGepInfoUpdates(event: any) {
		console.debug('[events-emitter] received info update', event);
	}

	private processGepGameInfo(event: any) {
		console.debug('[events-emitter] received info', event);
	}
}
