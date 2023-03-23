import { Injectable } from '@angular/core';
import { EventsEmitterService } from './events/events-emitter.service';
import { GameStateService } from './game-state/game-state.service';
import { OverlayWindowControllerService } from './window/overlay-window-controller.service';

@Injectable()
export class CompanionBackgroundService {
	constructor(
		private readonly overlayWindowController: OverlayWindowControllerService,
		private readonly gameState: GameStateService,
		private readonly eventsEmitter: EventsEmitterService,
	) {}

	public async init(): Promise<void> {
		await this.eventsEmitter.init();
		await this.gameState.init();
		this.overlayWindowController.init();
	}
}
