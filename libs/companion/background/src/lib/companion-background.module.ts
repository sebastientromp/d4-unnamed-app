import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CompanionBackgroundComponent } from './companion-background.component';
import { CompanionBackgroundService } from './companion-background.service';
import { AppStoreFacadeService } from './events/app-store/app-store-facade.service';
import { AppStoreService } from './events/app-store/app-store.service';
import { EventsEmitterService } from './events/events-emitter.service';
import { MockEventsService } from './events/mock-events.service';
import { GameStateService } from './game-state/game-state.service';
import { SessionTrackerService } from './session-tracker/session-tracker.service';
import { OverlayWindowControllerService } from './window/overlay-window-controller.service';

const components = [CompanionBackgroundComponent];

@NgModule({
	imports: [CommonModule],
	providers: [
		CompanionBackgroundService,
		AppStoreService,
		AppStoreFacadeService,
		OverlayWindowControllerService,
		GameStateService,
		EventsEmitterService,
		MockEventsService,
		SessionTrackerService,
	],
	declarations: components,
	exports: components,
})
export class CompanionBackgroundModule {}
