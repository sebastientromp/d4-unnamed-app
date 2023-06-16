import {
	AfterContentInit,
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Renderer2,
} from '@angular/core';
import { AppStoreFacadeService } from '@main-app/companion/background';
import { LocalStorageService, OverwolfService } from '@main-app/companion/common';
import { GameSessionLocationEvent } from 'libs/companion/background/src/lib/session-tracker/game-session.model';
import { Observable, combineLatest, filter, map } from 'rxjs';
import { AbstractWidgetWrapperComponent } from '../_widget-wrapper.component';
import { SessionTrackerSection } from './session-tracker-section.model';

@Component({
	selector: 'session-tracker-widget',
	styleUrls: ['./session-tracker-widget.component.scss'],
	template: `<div class="session-tracker">
		<div class="background"></div>
		<div class="controls">
			<div class="title">Session recap</div>
			<div class="buttons">
				<!-- <div
					class="button reset"
					[helpTooltip]="'session.buttons.reset-tooltip' | owTranslate"
					inlineSVG="assets/svg/restore.svg"
					(click)="reset()"
				></div> -->
				<control-close class="button close" (requestClose)="close()"></control-close>
			</div>
		</div>
		<div class="session-recap">
			<session-tracker-section-content class="overview" [title]="'Overview'" [section]="overview$ | async">
			</session-tracker-section-content>
			<div class="details">
				<div class="section" *ngFor="let section of sections$ | async">
					<session-tracker-section-content class="overview" [title]="section.title" [section]="section">
					</session-tracker-section-content>
				</div>
			</div>
		</div>
	</div>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionTrackerWidgetComponent
	extends AbstractWidgetWrapperComponent
	implements AfterContentInit, AfterViewInit
{
	sections$!: Observable<readonly GameSessionLocationEvent[]>;
	overview$!: Observable<SessionTrackerSection>;

	private windowId!: string;

	protected defaultPositionLeftProvider = (gameWidth: number, gameHeight: number, dpi: number) => gameWidth - 200;
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
		this.sections$ = this.store.gameSession$$().pipe(this.mapData((session) => session?.locationEvents ?? []));
		const totalGoldEarned$ = this.store
			.gameSession$$()
			.pipe(
				this.mapData(
					(session) => session?.locationEvents.map((loc) => loc.goldEarned).reduce((a, b) => a + b, 0) ?? 0,
				),
			);
		const totalTimeSpentInClosedLocs$ = this.store.gameSession$$().pipe(
			this.mapData(
				(session) =>
					session?.locationEvents
						.filter((loc) => loc.exitTimestamp != null)
						.map((loc) => (loc.exitTimestamp as number) - loc.enterTimestamp)
						.reduce((a, b) => a + b, 0) ?? 0,
			),
		);
		const totalTimeInCurrentLoc$ = this.store.gameSession$$().pipe(
			map((session) => session?.locationEvents.find((loc) => loc.exitTimestamp == null)),
			filter((loc) => !!loc),
			this.mapData((loc) => Date.now() - (loc?.enterTimestamp as number)),
		);
		const totalTimeSpent$ = combineLatest([totalTimeSpentInClosedLocs$, totalTimeInCurrentLoc$]).pipe(
			this.mapData(([closed, current]) => closed + current),
		);
		this.overview$ = combineLatest([totalGoldEarned$, totalTimeSpent$]).pipe(
			this.mapData(([gold, duration]) => {
				return {
					title: 'Overview',
					goldEarned: gold,
					timeSpentInMillis: duration,
				} as SessionTrackerSection;
			}),
		);
	}

	async ngAfterViewInit() {
		this.windowId = (await this.ow.getCurrentWindow()).id;
		this.ow.addGameInfoUpdatedListener(async (res) => {
			if (res && res.resolutionChanged) {
				this.ow.maximize(this.windowId);
			}
		});
		this.ow.maximize(this.windowId);
	}

	close() {
		console.debug('[session-tracker] closing window');
	}
}

const formatMilliseconds = (milliseconds: number): string => {
	const date = new Date(milliseconds);

	const hours = date.getUTCHours() > 0 ? String(date.getUTCHours()).padStart(2, '0') + ':' : '';
	const minutes =
		date.getUTCHours() > 0 || date.getUTCMinutes() > 0 ? String(date.getUTCMinutes()).padStart(2, '0') + ':' : '';
	const seconds = String(date.getUTCSeconds()).padStart(2, '0');

	return `${hours}${minutes}${seconds}`;
};
