import { AfterContentInit, Component, HostListener } from '@angular/core';
import { OverwolfService } from '@main-app/companion/common';

@Component({
	selector: 'main-app-top-bar',
	templateUrl: './top-bar.component.html',
	styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements AfterContentInit {
	private windowId: string | undefined;

	constructor(private readonly ow: OverwolfService) {}

	async ngAfterContentInit(): Promise<void> {
		const currentWindow = await this.ow.getCurrentWindow();
		this.windowId = currentWindow?.id;
	}

	@HostListener('mousedown', ['$event'])
	dragMove(event: MouseEvent) {
		if (!this.windowId) {
			return;
		}

		this.ow.dragMove(this.windowId);
	}
}
