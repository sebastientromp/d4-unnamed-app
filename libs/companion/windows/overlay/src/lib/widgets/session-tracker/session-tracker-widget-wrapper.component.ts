import {
	AfterContentInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Renderer2,
} from '@angular/core';
import { AppStoreFacadeService } from '@main-app/companion/background';
import { LocalStorageService, OverwolfService } from '@main-app/companion/common';
import { Observable, combineLatest, distinctUntilChanged, map, tap } from 'rxjs';
import { AbstractWidgetWrapperComponent } from '../_widget-wrapper.component';

@Component({
	selector: 'session-tracker-widget-wrapper',
	styleUrls: ['../widget-wrapper.component.scss'],
	template: `<session-tracker-widget
		class="widget"
		*ngIf="showWidget$ | async"
		cdkDrag
		(cdkDragStarted)="startDragging()"
		(cdkDragReleased)="stopDragging()"
		(cdkDragEnded)="dragEnded($event)"
	></session-tracker-widget>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionTrackerWidgetWrapperComponent extends AbstractWidgetWrapperComponent implements AfterContentInit {
	showWidget$!: Observable<boolean>;

	private windowId!: string;

	protected defaultPositionLeftProvider = (gameWidth: number, gameHeight: number, dpi: number) => 0;
	protected defaultPositionTopProvider = (gameWidth: number, gameHeight: number, dpi: number) => gameHeight - 200;

	constructor(
		protected override readonly ow: OverwolfService,
		protected override readonly cdr: ChangeDetectorRef,
		protected override readonly el: ElementRef,
		protected override readonly renderer: Renderer2,
		protected override readonly localStorage: LocalStorageService,
		private readonly store: AppStoreFacadeService,
	) {
		super(el, renderer, cdr, ow, localStorage);
		super.widgetName = 'session-recap';
	}

	async ngAfterContentInit(): Promise<void> {
		console.debug('initializing showWidget$', this.store.inMatch$$(), this.store.inGame$$());
		this.showWidget$ = combineLatest([this.store.inMatch$$(), this.store.inGame$$()]).pipe(
			tap((info) => console.log('show widget?', info)),
			map(([inMatch, inGame]) => inMatch || inGame),
			distinctUntilChanged(),
			this.handleReposition(),
		);

		this.windowId = (await this.ow.getCurrentWindow()).id;
		this.ow.addGameInfoUpdatedListener(async (res) => {
			if (res && res.resolutionChanged) {
				this.ow.maximize(this.windowId);
			}
		});
		this.ow.maximize(this.windowId);
	}
}
