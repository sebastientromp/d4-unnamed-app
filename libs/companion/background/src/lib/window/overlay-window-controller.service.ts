import { Injectable } from '@angular/core';
import { GameStatusService, OverwolfService } from '@main-app/companion/common';

@Injectable()
export class OverlayWindowControllerService {
	constructor(private readonly gameStatus: GameStatusService, private readonly ow: OverwolfService) {}

	public async init(): Promise<void> {
		this.gameStatus.inGame$$.subscribe((inGame) => {
			if (inGame) {
				this.openWindow();
			} else {
				this.closeWindow();
			}
		});
	}

	private async openWindow() {
		const overlayWindow = await this.ow.obtainDeclaredWindow(OverwolfService.OVERLAY);
		this.ow.restoreWindow(overlayWindow.id);
	}

	private async closeWindow() {
		const overlayWindow = await this.ow.obtainDeclaredWindow(OverwolfService.OVERLAY);
		this.ow.closeWindow(overlayWindow.id);
	}
}
