import { Injectable } from '@angular/core';
import { GameStatusService, Preferences, PreferencesService } from '@main-app/companion/common';
import { BehaviorSubject } from 'rxjs';
import { GameStateService } from '../../game-state/game-state.service';
import { GameSession } from '../../session-tracker/game-session.model';
import { SessionTrackerService } from '../../session-tracker/session-tracker.service';
import { SessionWidgetControllerService } from '../../session-tracker/session-widget-controller.service';
import { EventsEmitterService } from '../events-emitter.service';
import { AppEventName, AppStoreService } from './app-store.service';

@Injectable()
export class AppStoreFacadeService {
	public eventBus$$ = new BehaviorSubject<StoreEvent | null>(null);

	public prefs$$ = new BehaviorSubject<Preferences | null>(null);
	public inGame$$ = new BehaviorSubject<boolean>(false);
	public inMatch$$ = new BehaviorSubject<boolean | null>(null);
	public location$$ = new BehaviorSubject<string | null>(null);
	// public totalTimeSpentInMatchInMiilis$$ = new BehaviorSubject<number>(0);
	public currentGold$$ = new BehaviorSubject<number | null>(null);
	public gameSession$$ = new BehaviorSubject<GameSession | null>(null);
	public shouldTrackSession$$ = new BehaviorSubject<boolean>(false);
	public sessionWidgetClosedByUser$$ = new BehaviorSubject<boolean>(false);

	private initialized = false;

	constructor(
		private readonly eventsEmitter: EventsEmitterService,
		private readonly gameStatus: GameStatusService,
		private readonly gameState: GameStateService,
		private readonly sessionTracker: SessionTrackerService,
		private readonly sessionWidgetController: SessionWidgetControllerService,
		private readonly appStore: AppStoreService,
		private readonly prefs: PreferencesService,
	) {
		(window as any)['appStore'] = this;
		this.init();
	}

	public updatePref(field: keyof Preferences, value: any) {
		this.prefs.setValue(field, value);
	}

	public send(eventName: AppEventName) {
		this.appStore.send(eventName);
	}

	private async init() {
		this.inGame$$ = this.gameStatus.inGame$$;
		this.inMatch$$ = this.eventsEmitter.inMatch$$;
		this.location$$ = this.eventsEmitter.currentLocation$$;
		// this.totalTimeSpentInMatchInMiilis$$ = this.gameState.totalTimeSpentInMatchInMillis$$;
		this.currentGold$$ = this.eventsEmitter.currentGold$$;
		this.gameSession$$ = this.sessionTracker.gameSession$$ as BehaviorSubject<GameSession | null>;
		this.shouldTrackSession$$ = this.sessionWidgetController.shouldTrack$$;
		this.sessionWidgetClosedByUser$$ = this.sessionWidgetController.closedByUser$$;
		this.prefs$$ = this.prefs.prefs$$;

		this.initialized = true;
	}

	public async initComplete(): Promise<void> {
		return new Promise<void>((resolve) => {
			const dbWait = () => {
				if (this.initialized) {
					resolve();
				} else {
					console.warn('wait for store init');
					setTimeout(() => dbWait(), 500);
				}
			};
			dbWait();
		});
	}
}

export interface StoreEvent {
	readonly name: StoreEventName;
	readonly data: any;
}

export type StoreEventName = 'session-tracker-visibility-changed';
