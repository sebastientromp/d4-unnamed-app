import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { AbstractSubscriptionComponent } from '@main-app/companion/common';
import { GameSessionLocationOverview } from 'libs/companion/background/src/lib/session-tracker/game-session.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
	selector: 'session-tracker-section-content',
	styleUrls: ['./session-tracker-section-content.component.scss'],
	template: ` <div class="section">
		<div class="header">
			<div class="text">{{ title }}</div>
			<div class="time">{{ duration$ | async }}</div>
		</div>
		<div class="content">
			<div class="stat gold">
				<img class="icon" src="assets/images/gold.webp" />
				<div class="value">{{ goldEarned }}</div>
				<div class="value-per-hour">{{ goldEarnedPerMinute$ | async }}</div>
			</div>
		</div>
	</div>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionTrackerSectionContentComponent extends AbstractSubscriptionComponent implements AfterContentInit {
	duration$!: Observable<string | null>;
	goldEarnedPerMinute$!: Observable<string | null>;

	@Input() set section(value: GameSessionLocationOverview | null) {
		if (!value) {
			return;
		}

		this.title = value.location;
		this.goldEarned = value.goldEarned;
		if (value.exitTimestamp != null) {
			if (this.durationInterval) {
				clearInterval(this.durationInterval);
			}
			this.totalDurationInMillis = value.totalTimeSpentInMillis ?? 0;
			this.duration$$.next(this.totalDurationInMillis);
			this.goldEarnedPerMinute$$.next((value.goldEarned / (value.totalTimeSpentInMillis ?? 0)) * 60000);
		} else {
			this.durationInterval = setInterval(() => {
				this.totalDurationInMillis = (value.totalTimeSpentInMillis ?? 0) + (Date.now() - value.enterTimestamp);
				this.duration$$.next(this.totalDurationInMillis);
				const goldEarnedPerMinuteValue = (value.goldEarned / this.totalDurationInMillis) * 60000;
				this.goldEarnedPerMinute$$.next(Math.round(goldEarnedPerMinuteValue));
			});
		}
	}

	title!: string;
	goldEarned!: number | null;

	private duration$$ = new BehaviorSubject<number>(0);
	private goldEarnedPerMinute$$ = new BehaviorSubject<number>(0);

	private totalDurationInMillis: number = 0;
	private durationInterval: any;

	constructor(protected override readonly cdr: ChangeDetectorRef) {
		super(cdr);
	}

	ngAfterContentInit(): void {
		this.duration$ = this.duration$$.asObservable().pipe(this.mapData((duration) => formatDuration(duration)));
		this.goldEarnedPerMinute$ = this.goldEarnedPerMinute$$
			.asObservable()
			.pipe(this.mapData((duration) => `${duration} / min`));
	}
}

const formatDuration = (milliseconds: number): string => {
	const date = new Date(milliseconds);

	const hours = date.getUTCHours() > 0 ? String(date.getUTCHours()).padStart(2, '0') + ':' : '';
	const minutes =
		date.getUTCHours() > 0 || date.getUTCMinutes() > 0 ? String(date.getUTCMinutes()).padStart(2, '0') + ':' : '';
	const seconds = String(date.getUTCSeconds()).padStart(2, '0');

	return `${hours}${minutes}${seconds}`;
};
