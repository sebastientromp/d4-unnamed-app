import { Injectable } from '@angular/core';
import { OverwolfService } from '@main-app/companion/common';
import { BehaviorSubject } from 'rxjs';
import { MockEventsService } from './mock-events.service';

import territories from '../data/territories.json';
// import '@overwolf/types';

@Injectable()
export class EventsEmitterService {
	public inMatch$$ = new BehaviorSubject<boolean>(false);
	public currentGold$$ = new BehaviorSubject<number | null>(null);
	public currentLocation$$ = new BehaviorSubject<string | null>(null);

	constructor(private readonly ow: OverwolfService, private readonly mockEvents: MockEventsService) {}

	public async init(): Promise<void> {
		console.log('init events emitter service');
		overwolf.games.events.onNewEvents.addListener((events) => {
			for (const event of events.events) {
				this.processNewGepEvent(event);
			}
		});
		overwolf.games.events.onInfoUpdates2.addListener((event) => {
			this.processNewGepInfoUpdates(event);
		});
		overwolf.games.events.getInfo((event) => {
			this.processGepGameInfo(event);
		});
		await this.ow.setRequiredFeatures(['match_info', 'location']);

		this.mockEvents.events$$.subscribe((events) => {
			for (const event of events) {
				this.processNewGepEvent(event);
			}
		});
	}

	private processNewGepEvent(event: overwolf.games.events.GameEvent) {
		console.debug('[events-emitter] received event', event);
		switch (event.name) {
			case 'match_start':
				this.inMatch$$.next(true);
				break;
			case 'match_end':
				this.inMatch$$.next(false);
				break;
			case 'current_gold':
				this.currentGold$$.next(parseInt(event.data));
				break;
			case 'current_location':
				break;
		}
	}

	private processNewGepInfoUpdates(event: any) {
		console.debug('[events-emitter] received info update', event);
		const matchInfo = event?.info?.match_info;
		if (!matchInfo) {
			return;
		}

		if (matchInfo.location) {
			const location: { x: number; y: number; z: number } = JSON.parse(matchInfo.location);
			const region = this.buildRegion(location);
			console.debug('built region', region, location);
			this.currentLocation$$.next(region);
		}
	}

	private processGepGameInfo(event: any) {
		console.debug('[events-emitter] received info', event);
	}

	private buildRegion(data: { x: number; y: number; z: number }): string {
		const territory = getTerritoryByPoint({ x: data.x, y: data.y });
		return (territory?.name || territory?.id) ?? 'Unknown';
	}
}

export const isPointInsidePolygon = (point: { x: number; y: number }, polygon: readonly { x: number; y: number }[]) => {
	const x = point.x;
	const y = point.y;

	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const xi = polygon[i].x,
			yi = polygon[i].y;
		const xj = polygon[j].x,
			yj = polygon[j].y;

		const intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
		if (intersect) inside = !inside;
	}

	return inside;
};

export const getTerritoryByPoint = (point: { x: number; y: number }) => {
	return territories.find((territory) => isPointInsidePolygon(point, territory.points));
};
