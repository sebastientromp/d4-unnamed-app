import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GameStatusService } from './services/game-status.service';
import { LocalStorageService } from './services/local-storage.service';
import { OverwolfService } from './services/overwolf.service';

@NgModule({
	imports: [CommonModule],
	providers: [OverwolfService, GameStatusService, LocalStorageService],
})
export class CompanionCommonModule {}
