import {
	AfterContentInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Renderer2,
} from '@angular/core';
import { LocalStorageService, OverwolfService } from '@main-app/companion/common';
import { AbstractWidgetWrapperComponent } from '../_widget-wrapper.component';

@Component({
	selector: 'session-tracker-widget',
	styleUrls: ['./session-tracker-widget.component.scss'],
	template: `<div class="session-tracker"></div>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionTrackerWidgetComponent extends AbstractWidgetWrapperComponent implements AfterContentInit {
	private windowId!: string;

	protected defaultPositionLeftProvider = (gameWidth: number, gameHeight: number, dpi: number) => gameWidth - 200;
	protected defaultPositionTopProvider = (gameWidth: number, gameHeight: number, dpi: number) => gameHeight - 200;

	constructor(
		protected override readonly ow: OverwolfService,
		protected override readonly cdr: ChangeDetectorRef,
		protected override readonly el: ElementRef,
		protected override readonly renderer: Renderer2,
		protected override readonly localStorage: LocalStorageService,
	) {
		super(el, renderer, cdr, ow, localStorage);
		super.widgetName = 'session-recap';
	}

	async ngAfterContentInit(): Promise<void> {
		this.windowId = (await this.ow.getCurrentWindow()).id;
		this.ow.addGameInfoUpdatedListener(async (res) => {
			if (res && res.resolutionChanged) {
				this.ow.maximize(this.windowId);
			}
		});
		this.ow.maximize(this.windowId);
	}
}
