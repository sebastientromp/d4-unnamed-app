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
		generateNewLocation();
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
