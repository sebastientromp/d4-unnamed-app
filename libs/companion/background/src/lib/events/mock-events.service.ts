import { Injectable } from '@angular/core';
import { pickRandom } from '@main-app/companion/common';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MockEventsService {
	public events$$ = new BehaviorSubject<overwolf.games.events.GameEvent[]>([]);

	constructor() {
		this.initGold();
		this.initLocation();
	}

	private async initLocation() {
		const locations = ['kyovashad', 'desolate_highliands', 'derelict_lodge', 'sarkova_pass'];
		const generateNewLocation = () => {
			const loc = pickRandom(locations);
			this.events$$.next([
				{
					name: 'current_location',
					data: loc as string,
				},
			]);
		};
		(window as any)['newLocation'] = generateNewLocation;
		// generateNewLocation();
	}

	private async initGold() {
		const totalGold = Math.floor(Math.random() * 10000);
		const generateNewGold = () => {
			const newGold = Math.floor(Math.random() * 1000) - 500;
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
