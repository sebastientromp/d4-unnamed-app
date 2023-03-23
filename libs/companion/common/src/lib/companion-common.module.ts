import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GameStatusService } from './services/game-status.service';
import { OverwolfService } from './services/overwolf.service';

@NgModule({
	imports: [CommonModule],
	providers: [OverwolfService, GameStatusService],
})
export class CompanionCommonModule {}
