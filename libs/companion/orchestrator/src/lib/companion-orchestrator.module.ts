import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CompanionBackgroundModule } from '@main-app/companion/background';
import { CompanionCommonModule } from '@main-app/companion/common';
import { CompanionWindowsMainModule } from '@main-app/companion/windows/main';
import { CompanionWindowsOverlayModule } from '@main-app/companion/windows/overlay';
import { CompanionBootstrapService } from './companion-bootstrap.service';
import { CompanionOrchestratorComponent } from './companion-orchestrator.component';

const components = [CompanionOrchestratorComponent];

@NgModule({
	imports: [
		CommonModule,
		CompanionCommonModule,
		CompanionBackgroundModule,
		CompanionWindowsMainModule,
		CompanionWindowsOverlayModule,
	],
	providers: [CompanionBootstrapService],
	declarations: components,
	exports: components,
})
export class CompanionOrchestratorModule {}
