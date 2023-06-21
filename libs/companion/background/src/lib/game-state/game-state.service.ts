import { Injectable } from '@angular/core';
import { EventsEmitterService } from '../events/events-emitter.service';

@Injectable()
export class GameStateService {
	// public totalTimeSpentInMatchInMillis$$ = new BehaviorSubject<number>(0);

	constructor(private readonly eventsEmitter: EventsEmitterService) {}

	private totalTimeSpentInMatchInterval: NodeJS.Timer | null = null;

	public async init(): Promise<void> {
		console.log('init game state service');
		// this.eventsEmitter.inMatch$$.subscribe((inMatch) => {
		// 	if (inMatch) {
		// 		this.startTrackingTimeSpentInMatch();
		// 	} else {
		// 		this.stopTrackingTimeSpentInMatch();
		// 	}
		// });
	}

	// private startTrackingTimeSpentInMatch() {
	// 	this.stopTrackingTimeSpentInMatch();
	// 	const startTime = Date.now();
	// 	console.debug('starting to track time spent in match', startTime);
	// 	this.totalTimeSpentInMatchInterval = setInterval(() => {
	// 		this.totalTimeSpentInMatchInMillis$$.next(Date.now() - startTime);
	// 	}, 100);
	// }

	// private stopTrackingTimeSpentInMatch() {
	// 	this.totalTimeSpentInMatchInMillis$$.next(0);
	// 	if (this.totalTimeSpentInMatchInterval) {
	// 		clearInterval(this.totalTimeSpentInMatchInterval);
	// 	}
	// }
}
