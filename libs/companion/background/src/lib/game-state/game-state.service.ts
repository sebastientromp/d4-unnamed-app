import { Injectable } from '@angular/core';

@Injectable()
export class GameStateService {
	public async init(): Promise<void> {
		console.log('init game state service');
	}
}
