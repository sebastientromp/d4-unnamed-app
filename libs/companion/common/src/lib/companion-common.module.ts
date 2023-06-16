import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GameStatusService } from './services/game-status.service';
import { LocalStorageService } from './services/local-storage.service';
import { OverwolfService } from './services/overwolf.service';

// const components = [];

@NgModule({
	imports: [CommonModule],
	providers: [OverwolfService, GameStatusService, LocalStorageService],
	// declarations: components,
	// exports: components,
})
export class CompanionCommonModule {}
