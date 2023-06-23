import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MockEventsService {
	public events$$ = new BehaviorSubject<overwolf.games.events.GameEvent[]>([]);

	constructor() {
		this.initGold();
	}

	private async initGold() {
		let totalGold = 10000 + Math.floor(Math.random() * 10000);
		const generateNewGold = () => {
			const newGold = Math.floor(Math.random() * 1000);
			totalGold += newGold;
			this.events$$.next([
				{
					name: 'current_gold',
					data: `${totalGold + newGold}`,
				},
			]);
		};
		(window as any)['newGold'] = generateNewGold;
	}
}
