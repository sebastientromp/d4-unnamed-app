import { Injectable } from '@angular/core';
import { OverwolfService, sleep } from '@main-app/companion/common';
import { AppStoreFacadeService } from './app-store-facade.service';
import { AppEventName } from './app-store.service';

@Injectable()
export class AppStoreUiFacadeService {
	private store!: AppStoreFacadeService;

	constructor(private readonly ow: OverwolfService) {
		this.init();
	}

	public inGame$$ = () => this.store.inGame$$;
	public inMatch$$ = () => this.store.inMatch$$;
	public location$$ = () => this.store.location$$;
	public totalTimeSpentInMatchInMiilis$$ = () => this.store.totalTimeSpentInMatchInMiilis$$;
	public currentGold$$ = () => this.store.currentGold$$;
	public gameSession$$ = () => this.store.gameSession$$;

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
			console.debug(this.ow.getMainWindow());
			await sleep(200);
		}
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
