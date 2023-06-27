import { Injectable } from '@angular/core';
import { OverwolfService } from '@main-app/companion/common';
import { BehaviorSubject } from 'rxjs';
import { MockEventsService } from './mock-events.service';

// import '@overwolf/types';

@Injectable()
export class EventsEmitterService {
	public inMatch$$ = new BehaviorSubject<boolean | null>(null);
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
			this.processGepGameInfo(event.res);
		});
		await this.ow.setRequiredFeatures(['match_info', 'location', 'game_info', 'me', 'gep_internal']);

		this.mockEvents.events$$.subscribe((events) => {
			for (const event of events) {
				this.processNewGepEvent(event);
			}
		});
	}

	private processNewGepEvent(event: overwolf.games.events.GameEvent) {
		console.debug('[events-emitter] received event', event.name, event);
		switch (event.name) {
			case 'match_start':
				this.inMatch$$.next(true);
				break;
			case 'match_end':
				this.inMatch$$.next(false);
				break;
		}
	}

	private processNewGepInfoUpdates(event: any) {
		console.debug('[events-emitter] received info update', event.feature, event);
		const info = event?.info;
		this.processGepGameInfo(info);
	}

	private processGepGameInfo(info: any) {
		const matchInfo = info?.match_info;
		if (matchInfo?.location) {
			// const location: { x: number; y: number; z: number } = JSON.parse(matchInfo.location);
			// const region = this.buildRegion(location);
			// // The order is important, as we want the "session start" event to arrive first
			// console.debug('processing location', matchInfo.location, region, this.inMatch$$.value);
			// if (this.inMatch$$.value == null) {
			// 	this.inMatch$$.next(region != null);
			// }
			// this.currentLocation$$.next(region);
		}

		if (matchInfo?.map) {
			const mapObj: { area: number; territory: number } = JSON.parse(matchInfo.map);
			this.inMatch$$.next(!!mapObj.area);
			this.currentLocation$$.next('' + mapObj.area);
		}

		if (info?.gold) {
			this.currentGold$$.next(parseInt(info.gold.gold));
		}

		if (info?.character) {
			const character: { name?: string; level?: number; class?: number } = info.character;
		}

		if (info?.game_info) {
			const gameInfo: { battlenet_tag?: string } = info.game_info;
		}
	}

	// private buildRegion(data: { x: number; y: number; z: number }): string | null {
	// 	const territory = getTerritoryByPoint({ x: data.x, y: data.y });
	// 	if (territory) {
	// 		return (territory?.name || territory?.id) ?? 'Unknown';
	// 	}
	// 	console.debug('[events-emitter] could not find territory for', data);
	// 	return null;
	// }
}

// export const isPointInsidePolygon = (point: { x: number; y: number }, polygon: readonly { x: number; y: number }[]) => {
// 	const x = point.x;
// 	const y = point.y;

// 	let inside = false;
// 	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
// 		const xi = polygon[i].x,
// 			yi = polygon[i].y;
// 		const xj = polygon[j].x,
// 			yj = polygon[j].y;

// 		const intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
// 		if (intersect) inside = !inside;
// 	}

// 	return inside;
// };

// export const getTerritoryByPoint = (point: { x: number; y: number }) => {
// 	return territories.find((territory) => isPointInsidePolygon(point, territory.points));
// };
