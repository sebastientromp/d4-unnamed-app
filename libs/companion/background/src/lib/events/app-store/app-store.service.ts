import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AppStoreService {
	public eventsQueue$$ = new BehaviorSubject<AppEvent | null>(null);

	public send(eventName: AppEventName) {
		console.debug('sending event', eventName, this.eventsQueue$$);
		this.eventsQueue$$.next({
			eventName: eventName,
		});
	}
}

export interface AppEvent {
	readonly eventName: AppEventName;
}

export type AppEventName = 'reset-session' | 'close-session-widget';
