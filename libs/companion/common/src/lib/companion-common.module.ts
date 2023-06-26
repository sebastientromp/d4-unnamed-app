import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdService } from './services/ad.service';
import { GameStatusService } from './services/game-status.service';
import { LocalStorageService } from './services/local-storage.service';
import { OverwolfService } from './services/overwolf.service';
import { PreferencesService } from './services/preferences.service';
import { HelpTooltipComponent } from './tooltip/help-tooltip.component';
import { HelpTooltipDirective } from './tooltip/help-tooltip.directive';

const components = [HelpTooltipComponent, HelpTooltipDirective];

@NgModule({
	imports: [CommonModule],
	providers: [OverwolfService, GameStatusService, LocalStorageService, AdService, PreferencesService],
	declarations: components,
	exports: components,
})
export class CompanionCommonModule {}
