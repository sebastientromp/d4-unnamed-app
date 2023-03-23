import { Injectable } from '@angular/core';
import { GameStatusService } from '@main-app/companion/common';
import { BehaviorSubject } from 'rxjs';
import { EventsEmitterService } from '../events-emitter.service';

@Injectable()
export class AppStoreService {
	public inGame$$ = new BehaviorSubject<boolean>(false);
	public inMatch$$ = new BehaviorSubject<boolean>(false);

	private initialized = false;

	constructor(private readonly eventsEmitter: EventsEmitterService, private readonly gameStatus: GameStatusService) {
		(window as any)['appStore'] = this;
		this.init();
	}

	private async init() {
		this.inGame$$ = this.gameStatus.inGame$$;
		this.inMatch$$ = this.eventsEmitter.inMatch$$;
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
