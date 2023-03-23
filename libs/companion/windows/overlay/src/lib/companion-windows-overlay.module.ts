import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CompanionOverlayComponent } from './companion-overlay.component';

const components = [CompanionOverlayComponent];

@NgModule({
	imports: [CommonModule],
	declarations: components,
	exports: components,
})
export class CompanionWindowsOverlayModule {}
