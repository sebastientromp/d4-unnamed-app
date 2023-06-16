import { Injectable } from '@angular/core';
import { GameStatusService } from '@main-app/companion/common';
import { BehaviorSubject } from 'rxjs';
import { GameStateService } from '../../game-state/game-state.service';
import { GameSession } from '../../session-tracker/game-session.model';
import { SessionTrackerService } from '../../session-tracker/session-tracker.service';
import { EventsEmitterService } from '../events-emitter.service';

@Injectable()
export class AppStoreService {
	public inGame$$ = new BehaviorSubject<boolean>(false);
	public inMatch$$ = new BehaviorSubject<boolean>(false);
	public totalTimeSpentInMatchInMiilis$$ = new BehaviorSubject<number>(0);
	public currentGold$$ = new BehaviorSubject<number | null>(null);
	public gameSession$$ = new BehaviorSubject<GameSession | null>(null);

	private initialized = false;

	constructor(
		private readonly eventsEmitter: EventsEmitterService,
		private readonly gameStatus: GameStatusService,
		private readonly gameState: GameStateService,
		private readonly sessionTracker: SessionTrackerService,
	) {
		(window as any)['appStore'] = this;
		this.init();
	}

	private async init() {
		this.inGame$$ = this.gameStatus.inGame$$;
		this.inMatch$$ = this.eventsEmitter.inMatch$$;
		this.totalTimeSpentInMatchInMiilis$$ = this.gameState.totalTimeSpentInMatchInMillis$$;
		this.currentGold$$ = this.eventsEmitter.currentGold$$;
		this.gameSession$$ = this.sessionTracker.gameSession$$ as BehaviorSubject<GameSession | null>;

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
