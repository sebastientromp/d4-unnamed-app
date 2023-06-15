import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CompanionBackgroundComponent } from './companion-background.component';
import { CompanionBackgroundService } from './companion-background.service';
import { AppStoreFacadeService } from './events/app-store/app-store-facade.service';
import { AppStoreService } from './events/app-store/app-store.service';
import { EventsEmitterService } from './events/events-emitter.service';
import { GameStateService } from './game-state/game-state.service';
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
	],
	declarations: components,
	exports: components,
})
export class CompanionBackgroundModule {}
