import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CompanionWindowsCommonModule } from '@main-app/companion/windows/common';
import { CompanionMainComponent } from './companion-main.component';

const components = [CompanionMainComponent];

@NgModule({
	imports: [CommonModule, CompanionWindowsCommonModule],
	declarations: components,
	exports: components,
})
export class CompanionWindowsMainModule {}
