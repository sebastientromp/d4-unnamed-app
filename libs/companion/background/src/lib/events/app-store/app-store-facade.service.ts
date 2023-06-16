import { Injectable } from '@angular/core';
import { OverwolfService, sleep } from '@main-app/companion/common';
import { AppStoreService } from './app-store.service';

@Injectable()
export class AppStoreFacadeService {
	private store!: AppStoreService;

	constructor(private readonly ow: OverwolfService) {
		this.init();
	}

	public inGame$$ = () => this.store.inGame$$;
	public inMatch$$ = () => this.store.inMatch$$;
	public totalTimeSpentInMatchInMiilis$$ = () => this.store.totalTimeSpentInMatchInMiilis$$;
	public currentGold$$ = () => this.store.currentGold$$;

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
