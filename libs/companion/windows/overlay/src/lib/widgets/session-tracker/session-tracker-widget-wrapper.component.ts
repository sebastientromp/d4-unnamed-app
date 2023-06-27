import {
	AfterContentInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Renderer2,
} from '@angular/core';
import { AppStoreUiFacadeService } from '@main-app/companion/background';
import { LocalStorageService, OverwolfService } from '@main-app/companion/common';
import { Observable, combineLatest, tap } from 'rxjs';
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

	protected defaultPositionLeftProvider = (gameWidth: number, gameHeight: number, dpi: number) => 0;
	protected defaultPositionTopProvider = (gameWidth: number, gameHeight: number, dpi: number) => gameHeight - 200;

	constructor(
		protected override readonly ow: OverwolfService,
		protected override readonly cdr: ChangeDetectorRef,
		protected override readonly el: ElementRef,
		protected override readonly renderer: Renderer2,
		protected override readonly localStorage: LocalStorageService,
		private readonly store: AppStoreUiFacadeService,
	) {
		super(el, renderer, cdr, ow, localStorage);
		super.widgetName = 'session-recap';
	}

	async ngAfterContentInit(): Promise<void> {
		this.showWidget$ = combineLatest([this.store.shouldTrackSession$$(), this.store.prefs$$()]).pipe(
			tap((info) => console.debug('show widget?', info)),
			this.mapData(([shouldTrackSession, prefs]) => shouldTrackSession && !!prefs?.sessionTrackerOverlay),
			tap((info) => console.debug('will show widget?', info)),
			this.handleReposition(),
		);
	}
}
