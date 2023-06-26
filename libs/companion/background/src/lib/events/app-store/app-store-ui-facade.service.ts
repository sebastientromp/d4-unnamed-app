import { Injectable } from '@angular/core';
import { OverwolfService, Preferences, sleep } from '@main-app/companion/common';
import { BehaviorSubject } from 'rxjs';
import { AppStoreFacadeService, StoreEvent } from './app-store-facade.service';
import { AppEventName } from './app-store.service';

@Injectable()
export class AppStoreUiFacadeService {
	public eventBus$$ = new BehaviorSubject<StoreEvent | null>(null);

	private store!: AppStoreFacadeService;

	constructor(private readonly ow: OverwolfService) {
		this.init();
	}

	public prefs$$ = () => this.store.prefs$$;
	public inGame$$ = () => this.store.inGame$$;
	public inMatch$$ = () => this.store.inMatch$$;
	public location$$ = () => this.store.location$$;
	// public totalTimeSpentInMatchInMiilis$$ = () => this.store.totalTimeSpentInMatchInMiilis$$;
	public currentGold$$ = () => this.store.currentGold$$;
	public gameSession$$ = () => this.store.gameSession$$;
	public sessionWidgetClosedByUser$$ = () => this.store.sessionWidgetClosedByUser$$;

	public updatePref(field: keyof Preferences, value: any) {
		this.store.updatePref(field, value);
	}

	public send(eventName: AppEventName) {
		this.store.send(eventName);
	}

	public async initComplete(): Promise<void> {
		await this.waitForStoreInstance();
		return this.store.initComplete();
	}

	private async init() {
		this.store = this.ow.getMainWindow()?.appStore;
		while (!this.store) {
			console.warn('could not retrieve store from main window');
			await sleep(200);
			this.store = this.ow.getMainWindow()?.appStore;
		}
		this.eventBus$$ = this.store.eventBus$$;
	}

	private async waitForStoreInstance(): Promise<void> {
		return new Promise<void>((resolve) => {
			const dbWait = () => {
				if (this.store) {
					resolve();
				} else {
					setTimeout(() => dbWait(), 10);
				}
			};
			dbWait();
		});
	}
}
