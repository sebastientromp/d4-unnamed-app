import { Injectable } from '@angular/core';
import { AppStoreFacadeService } from './events/app-store/app-store-facade.service';
import { EventsEmitterService } from './events/events-emitter.service';
import { GameStateService } from './game-state/game-state.service';
import { SessionTrackerService } from './session-tracker/session-tracker.service';
import { OverlayWindowControllerService } from './window/overlay-window-controller.service';

@Injectable()
export class CompanionBackgroundService {
	constructor(
		private readonly overlayWindowController: OverlayWindowControllerService,
		private readonly gameState: GameStateService,
		private readonly eventsEmitter: EventsEmitterService,
		private readonly init_AppStore: AppStoreFacadeService,
		private readonly init_SessionTracker: SessionTrackerService,
	) {}

	public async init(): Promise<void> {
		await this.eventsEmitter.init();
		await this.gameState.init();
		this.init_SessionTracker.init();
		this.overlayWindowController.init();
	}
}
