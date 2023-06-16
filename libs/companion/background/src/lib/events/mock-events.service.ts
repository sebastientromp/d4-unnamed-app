import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MockEventsService {
	public events$$ = new BehaviorSubject<overwolf.games.events.GameEvent[]>([]);

	constructor() {
		this.initGold();
	}

	private async initGold() {
		let currentGold = Math.floor(Math.random() * 1000);
		this.events$$.next([
			{
				name: 'current_gold',
				data: `${currentGold}`,
			},
		]);
		setInterval(() => {
			// Also simulate gold lost (eg buying some stuff)
			currentGold += Math.floor(Math.random() * 100) - 20;
			this.events$$.next([
				{
					name: 'current_gold',
					data: `${currentGold}`,
				},
			]);
		}, 3000);
	}
}
