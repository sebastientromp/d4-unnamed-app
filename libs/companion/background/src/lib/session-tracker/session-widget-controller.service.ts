import { Injectable } from '@angular/core';
import { OverwolfService } from '@main-app/companion/common';
import { BehaviorSubject, distinctUntilChanged, filter, tap } from 'rxjs';
import { AppStoreService } from '../events/app-store/app-store.service';
import { EventsEmitterService } from '../events/events-emitter.service';

@Injectable()
export class SessionWidgetControllerService {
	public closedByUser$$ = new BehaviorSubject<boolean>(false);

	constructor(
		private readonly eventsEmitter: EventsEmitterService,
		private readonly appStore: AppStoreService,
		private readonly ow: OverwolfService,
	) {
		this.init();
	}

	private async init(): Promise<void> {
		this.eventsEmitter.inMatch$$.pipe(distinctUntilChanged()).subscribe((inMatch) => {
			if (inMatch) {
				this.closedByUser$$.next(false);
			}
		});
		this.appStore.eventsQueue$$
			.pipe(
				tap((e) => console.debug('received event', e)),
				filter((e) => e?.eventName === 'close-session-widget'),
			)
			.subscribe((resetEvent) => {
				console.debug('closed session widget', resetEvent);
				this.closedByUser$$.next(true);
			});

		this.ow.addHotKeyPressedListener('session-tracker', () => {
			this.closedByUser$$.next(!this.closedByUser$$.value);
		});
	}
}
