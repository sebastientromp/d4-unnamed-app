import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OverwolfService } from '@main-app/companion/common';

@Component({
	selector: 'main-app-control-close',
	styleUrls: [`./controls.scss`, `./control-close.component.scss`],
	template: ` <button class="control close" inlineSVG="assets/svg/close.svg" (click)="closeWindow()"></button> `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlCloseComponent {
	constructor(private readonly ow: OverwolfService) {}

	async closeWindow() {
		const window = await this.ow.obtainDeclaredWindow(OverwolfService.CONTROLLER);
		this.ow.closeWindow(window?.id);
	}
}
