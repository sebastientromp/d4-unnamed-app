import { AfterContentInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { OverwolfService } from '@main-app/companion/common';

@Component({
	selector: 'main-app-companion-overlay',
	styleUrls: ['./companion-overlay.component.scss'],
	template: `
		<div id="container" class="full-screen-overlays drag-boundary overlay-container-parent fiery-theme">
			<session-tracker-widget-wrapper></session-tracker-widget-wrapper>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanionOverlayComponent implements AfterContentInit {
	private windowId!: string;

	constructor(private readonly ow: OverwolfService) {}

	async ngAfterContentInit(): Promise<void> {
		this.windowId = (await this.ow.getCurrentWindow()).id;
		this.ow.addGameInfoUpdatedListener(async (res) => {
			if (res && res.resolutionChanged) {
				this.maximize();
			}
		});
		this.maximize();
	}

	private async maximize(): Promise<void> {
		const gameInfo = await this.ow.getRunningGameInfo();
		if (!gameInfo) {
			return;
		}
		const gameWidth = gameInfo.width;
		const gameHeight = gameInfo.height;
		const height = gameHeight;
		const width = gameWidth;
		await this.ow.changeWindowSize(this.windowId, width, height);
		await this.ow.changeWindowPosition(this.windowId, 0, 0);
		window.dispatchEvent(new Event('window-resize'));
	}
}
