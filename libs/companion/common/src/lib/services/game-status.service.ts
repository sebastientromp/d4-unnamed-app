import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OverwolfService } from './overwolf.service';

@Injectable()
export class GameStatusService {
	public inGame$$ = new BehaviorSubject<boolean>(false);

	constructor(private readonly ow: OverwolfService) {
		this.init();
	}

	public async inGame(): Promise<boolean> {
		return this.ow.inGame();
	}

	private async init() {
		this.ow.addGameInfoUpdatedListener(async (res) => {
			if (this.ow.exitGame(res)) {
				this.inGame$$.next(false);
			} else if ((await this.ow.inGame()) && (res.gameChanged || res.runningChanged)) {
				this.inGame$$.next(true);
				console.debug('[game-status] game launched', res);
			}
		});

		if (await this.ow.inGame()) {
			this.inGame$$.next(true);
		}
	}
}
