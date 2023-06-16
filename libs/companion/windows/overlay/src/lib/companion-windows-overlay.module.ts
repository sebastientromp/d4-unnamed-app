import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CompanionBackgroundModule } from '@main-app/companion/background';
import { CompanionWindowsCommonModule } from '@main-app/companion/windows/common';
import { CompanionOverlayComponent } from './companion-overlay.component';
import { SessionTrackerWidgetWrapperComponent } from './widgets/session-tracker/session-tracker-widget-wrapper.component';
import { SessionTrackerWidgetComponent } from './widgets/session-tracker/session-tracker-widget.component';

const components = [CompanionOverlayComponent, SessionTrackerWidgetWrapperComponent, SessionTrackerWidgetComponent];

@NgModule({
	imports: [CommonModule, DragDropModule, CompanionBackgroundModule, CompanionWindowsCommonModule],
	declarations: components,
	exports: components,
})
export class CompanionWindowsOverlayModule {}
