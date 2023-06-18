import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { AppStoreFacadeService, GameSession, GameSessionLocationOverview } from '@main-app/companion/background';
import { AbstractSubscriptionComponent } from '@main-app/companion/common';
import { Observable, filter, map } from 'rxjs';

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
			<session-tracker-section-content class="overview" [section]="overview$ | async">
			</session-tracker-section-content>
			<div class="details">
				<div class="section" *ngFor="let section of sections$ | async; trackBy: trackBySection">
					<session-tracker-section-content class="overview" [section]="section">
					</session-tracker-section-content>
				</div>
			</div>
		</div>
	</div>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionTrackerWidgetComponent extends AbstractSubscriptionComponent implements AfterContentInit {
	sections$!: Observable<readonly GameSessionLocationOverview[]>;
	overview$!: Observable<GameSessionLocationOverview>;

	constructor(protected override readonly cdr: ChangeDetectorRef, private readonly store: AppStoreFacadeService) {
		super(cdr);
	}

	async ngAfterContentInit(): Promise<void> {
		this.sections$ = this.store.gameSession$$().pipe(map((session) => session?.locationOverviews ?? []));
		this.overview$ = this.store.gameSession$$().pipe(
			filter((session) => session != null),
			map((session) => session as GameSession),
			this.mapData((session) => {
				return {
					goldEarned: session.locationOverviews.reduce((acc, loc) => acc + loc.goldEarned, 0),
					totalTimeSpentInMillis: session.locationOverviews.reduce(
						(acc, loc) => acc + (loc.totalTimeSpentInMillis ?? 0),
						0,
					),
					enterTimestamp:
						session.locationOverviews.find((loc) => loc.exitTimestamp == null)?.enterTimestamp ?? 0,
					exitTimestamp: undefined,
				} as GameSessionLocationOverview;
			}),
		);
	}

	close(): void {
		console.debug('[session-tracker] closing');
	}

	trackBySection(index: number, section: GameSessionLocationOverview): string {
		return section.location;
	}
}
