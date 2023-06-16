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
import { BehaviorSubject, Observable, combineLatest, filter, sampleTime } from 'rxjs';
import { AbstractWidgetWrapperComponent } from '../_widget-wrapper.component';

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
			<div class="overview">
				<div class="header">
					<div class="text">Overview</div>
					<div class="time">{{ totalDuration$ | async }}</div>
				</div>
				<div class="content">
					<div class="stat gold">
						<img class="icon" src="assets/images/gold.webp" />
						<div class="value">{{ totalGoldEarned$$ | async }}</div>
						<div class="value-per-hour">{{ goldEarnedPerMinute$ | async }}</div>
					</div>
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
	totalDuration$!: Observable<string>;
	totalGoldEarned$$ = new BehaviorSubject<number>(0);
	goldEarnedPerMinute$!: Observable<string>;

	private windowId!: string;
	private currentGold$$ = new BehaviorSubject<number | null>(null);

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
		this.totalDuration$ = this.store.totalTimeSpentInMatchInMiilis$$().pipe(
			sampleTime(1000),
			this.mapData((durationInMillis) => {
				return formatMilliseconds(durationInMillis);
			}),
		);
		this.store
			.currentGold$$()
			.pipe(
				filter((gold) => gold != null),
				this.mapData((gold) => gold as number),
			)
			.subscribe((gold) => {
				// console.debug('[session-tracker] updating gold', gold);
				if (this.totalGoldEarned$$.getValue() == null) {
					this.currentGold$$.next(gold);
				} else {
					const earned = gold - (this.currentGold$$.getValue() as number);
					this.currentGold$$.next(gold);
					if (earned > 0) {
						this.totalGoldEarned$$.next(this.totalGoldEarned$$.getValue() + earned);
					} else {
						// console.debug(
						// 	'[session-tracker] ignoring negative gold update',
						// 	gold,
						// 	this.totalGoldEarned$$.getValue(),
						// );
					}
				}
			});
		this.goldEarnedPerMinute$ = combineLatest([
			this.totalGoldEarned$$,
			this.store.totalTimeSpentInMatchInMiilis$$(),
		]).pipe(
			this.mapData(([gold, duration]) => {
				if (gold == null || duration == null) {
					return '0';
				}
				const goldPerMinute = (gold / duration) * 60000;
				return `${Math.round(goldPerMinute).toLocaleString()} / min`;
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
