import { Injectable } from '@angular/core';
import { OverwolfService } from '@main-app/companion/common';
import { BehaviorSubject, Observable, combineLatest, distinctUntilChanged, filter, map, startWith, tap } from 'rxjs';
import { AppStoreUiFacadeService } from '../events/app-store/app-store-ui-facade.service';
import { AppStoreService } from '../events/app-store/app-store.service';

@Injectable()
export class SessionWidgetControllerService {
	public shouldTrack$$ = new BehaviorSubject<boolean>(true);
	public closedByUser$$ = new BehaviorSubject<boolean>(false);

	constructor(
		private readonly appStore: AppStoreService,
		private readonly store: AppStoreUiFacadeService,
		private readonly ow: OverwolfService,
	) {
		this.init();
		(window as any)['sessionTrackerWidgetController'] = this;
	}

	private async init(): Promise<void> {
		await this.store.initComplete();
		this.store
			.inMatch$$()
			.pipe(distinctUntilChanged())
			.subscribe((inMatch) => {
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

		combineLatest([this.store.inMatch$$(), this.store.prefs$$(), this.closedByUser$$])
			.pipe(
				map(([inMatch, prefs, closedByUser]) => ({
					inMatch: inMatch,
					useOverlay: prefs?.sessionTrackerOverlay,
					closedByUser: closedByUser,
				})),
				tap((info) => console.debug('[session-tracker-widget] should show window?', info)),
				distinctUntilChanged(),
			)
			.subscribe(async (info) => {
				console.debug('[session-tracker-widget] setting visibility', info);
				const sessionTrackerWindow = await this.ow.obtainDeclaredWindow(OverwolfService.SESSION_TRACKER);
				if (!info.inMatch || info.useOverlay || info.closedByUser) {
					this.ow.closeWindow(sessionTrackerWindow.id);
					return;
				}

				this.ow.restoreWindow(sessionTrackerWindow.id);
				this.ow.bringToFront(sessionTrackerWindow.id);
			});

		const adVisible$: Observable<boolean> = this.store.eventBus$$.pipe(
			filter((event) => event?.name === 'session-tracker-visibility-changed'),
			map((event) => event?.data.visible as 'hidden' | 'partial' | 'full'),
			distinctUntilChanged(),
			tap((info) => console.debug('[session-tracker-widget] ad visible?', info)),
			map((visible) => visible === 'full' || visible === 'partial'),
			startWith(true),
		);

		combineLatest([this.closedByUser$$, adVisible$]).subscribe(([closedByUser, adVisible]) => {
			console.debug('[session-tracker-widget] should track?', closedByUser, adVisible);
			this.shouldTrack$$.next(!closedByUser && adVisible);
		});
	}
}
