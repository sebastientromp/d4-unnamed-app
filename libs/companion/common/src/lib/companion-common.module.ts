import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GameStatusService } from './services/game-status.service';
import { LocalStorageService } from './services/local-storage.service';
import { OverwolfService } from './services/overwolf.service';
import { HelpTooltipComponent } from './tooltip/help-tooltip.component';
import { HelpTooltipDirective } from './tooltip/help-tooltip.directive';

const components = [HelpTooltipComponent, HelpTooltipDirective];

@NgModule({
	imports: [CommonModule],
	providers: [OverwolfService, GameStatusService, LocalStorageService],
	declarations: components,
	exports: components,
})
export class CompanionCommonModule {}
