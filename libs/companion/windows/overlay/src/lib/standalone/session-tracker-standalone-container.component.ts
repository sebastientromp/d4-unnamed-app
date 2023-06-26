import { AfterViewInit, ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { OverwolfService } from '@main-app/companion/common';

@Component({
	selector: 'session-tracker-standalone-container',
	styleUrls: ['./session-tracker-standalone-container.component.scss'],
	template: ` <div
		id="container"
		class="session-tracker-container drag-boundary overlay-container-parent fiery-theme"
	>
		<session-tracker-widget class="widget"></session-tracker-widget>
	</div>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionTrackerOverlayStandaloneComponent implements AfterViewInit {
	private windowId!: string;

	constructor(private readonly ow: OverwolfService) {}

	async ngAfterViewInit() {
		const currentWindow = await this.ow.getCurrentWindow();
		this.windowId = currentWindow.id;
	}

	@HostListener('mousedown', ['$event'])
	dragMove(event: MouseEvent) {
		this.ow.dragMove(this.windowId);
	}
}
