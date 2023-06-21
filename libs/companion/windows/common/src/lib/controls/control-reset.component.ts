import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'control-reset',
	styleUrls: [`./controls.scss`, `./control-reset.component.scss`],
	template: ` <button class="control reset" inlineSVG="assets/svg/restore.svg" (click)="reset()"></button> `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlResetComponent {
	@Output() requestReset = new EventEmitter<void>();

	async reset() {
		this.requestReset.next();
	}
}
