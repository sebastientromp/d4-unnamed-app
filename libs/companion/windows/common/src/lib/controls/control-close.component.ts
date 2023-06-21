import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'control-close',
	styleUrls: [`./controls.scss`, `./control-close.component.scss`],
	template: ` <button class="control close" inlineSVG="assets/svg/close.svg" (click)="closeWindow()"></button> `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlCloseComponent {
	@Output() requestClose = new EventEmitter<void>();

	async closeWindow() {
		this.requestClose.next();
	}
}
