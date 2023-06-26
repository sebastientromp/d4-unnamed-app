import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { AppStoreUiFacadeService, GameSession, GameSessionLocationOverview } from '@main-app/companion/background';
import { AbstractSubscriptionComponent, AdService, OverwolfService } from '@main-app/companion/common';
import { Observable, filter, map, tap } from 'rxjs';

@Component({
	selector: 'session-tracker-widget',
	styleUrls: ['./session-tracker-widget.component.scss'],
	template: `<div class="session-tracker">
		<div class="content">
			<div class="background"></div>
			<div class="controls">
				<div class="title">Session recap</div>
				<div class="buttons">
					<preference-toggle
						field="sessionTrackerOverlay"
						[label]="'Set overlay'"
						[helpTooltip]="
							'Bind the lottery window to the game window, so that it is always visible. You should use this if the lottery is on the same screen as the game'
						"
					></preference-toggle>
					<control-reset
						class="button reset"
						[helpTooltip]="'Reset session'"
						(requestReset)="reset()"
					></control-reset>
					<control-close class="button close" (requestClose)="close()"></control-close>
				</div>
			</div>
			<div class="session-recap">
				<session-tracker-section-content class="overview" [section]="overview$ | async">
				</session-tracker-section-content>
				<div class="details">
					<div class="title">Zones</div>
					<div class="sections">
						<session-tracker-section-content
							class="section"
							*ngFor="let section of sections$ | async; trackBy: trackBySection"
							[section]="section"
						>
						</session-tracker-section-content>
					</div>
				</div>
			</div>
		</div>
		<single-ad class="ad" *ngIf="showAds$ | async" (adVisibility)="onAdVisibilityChanged($event)"></single-ad>
	</div>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionTrackerWidgetComponent extends AbstractSubscriptionComponent implements AfterContentInit {
	sections$!: Observable<readonly GameSessionLocationOverview[]>;
	overview$!: Observable<GameSessionLocationOverview>;
	showAds$!: Observable<boolean>;

	constructor(
		protected override readonly cdr: ChangeDetectorRef,
		private readonly store: AppStoreUiFacadeService,
		private readonly adService: AdService,
		private readonly ow: OverwolfService,
	) {
		super(cdr);
	}

	async ngAfterContentInit(): Promise<void> {
		this.sections$ = this.store.gameSession$$().pipe(
			map((session) => session?.locationOverviews ?? []),
			this.mapData((locations) =>
				[...locations].sort((a, b) => {
					if (!a.exitTimestamp) {
						return -1;
					}
					if (!b.exitTimestamp) {
						return 1;
					}
					return b.exitTimestamp - a.exitTimestamp;
				}),
			),
		);
		this.overview$ = this.store.gameSession$$().pipe(
			tap((session) => console.debug('[session-tracker] session', session, this.store)),
			filter((session) => session != null),
			map((session) => session as GameSession),
			this.mapData((session) => {
				const result = {
					location: 'overview',
					goldEarned: session.locationOverviews.reduce((acc, loc) => acc + loc.goldEarned, 0),
					totalTimeSpentInMillis: session.locationOverviews.reduce(
						(acc, loc) => acc + (loc.totalTimeSpentInMillis ?? 0),
						0,
					),
					enterTimestamp:
						session.locationOverviews.find((loc) => loc.exitTimestamp == null)?.enterTimestamp ?? 0,
					exitTimestamp: undefined,
				} as GameSessionLocationOverview;
				return result;
			}),
			tap((data) => console.debug('[session-tracker] overview data', data)),
		);
		this.showAds$ = this.adService.showAds$$.asObservable();

		const window = await this.ow.getCurrentWindow();
		console.debug('[session-tracker] window', window);
	}

	close(): void {
		console.debug('[session-tracker] close');
		this.store.send('close-session-widget');
	}

	reset(): void {
		this.store.send('reset-session');
	}

	trackBySection(index: number, section: GameSessionLocationOverview): string {
		return section.location;
	}

	onAdVisibilityChanged(visible: 'hidden' | 'partial' | 'full') {
		this.store.eventBus$$.next({ name: 'session-tracker-visibility-changed', data: { visible } });
	}
}
