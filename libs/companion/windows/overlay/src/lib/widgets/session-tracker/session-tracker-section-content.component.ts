import {
	AfterContentInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Input,
	OnDestroy,
} from '@angular/core';
import { GameSessionLocationOverview } from '@main-app/companion/background';
import { AbstractSubscriptionComponent } from '@main-app/companion/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
	selector: 'session-tracker-section-content',
	styleUrls: ['./session-tracker-section-content.component.scss'],
	template: ` <div class="section" *ngIf="duration$ | async as duration">
		<div class="header">
			<div class="text" [ngClass]="{ title: isOverview }">{{ title }}</div>
			<div class="time">{{ duration }}</div>
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
export class SessionTrackerSectionContentComponent
	extends AbstractSubscriptionComponent
	implements AfterContentInit, OnDestroy
{
	duration$!: Observable<string | null>;
	goldEarnedPerMinute$!: Observable<string | null>;

	@Input() set section(value: GameSessionLocationOverview | null) {
		console.debug('setting section', value);
		if (!value || !value.enterTimestamp) {
			return;
		}

		this.isOverview = value.location === 'overview';
		this.title = value.locationName;
		this.goldEarned = value.goldEarned;
		if (this.durationInterval) {
			clearInterval(this.durationInterval);
		}
		if (value.exitTimestamp != null) {
			this.totalDurationInMillis = value.totalTimeSpentInMillis ?? 0;
			this.duration$$.next(this.totalDurationInMillis);
			this.goldEarnedPerMinute$$.next((value.goldEarned / (value.totalTimeSpentInMillis ?? 0)) * 60000);
		} else {
			this.durationInterval = setInterval(() => {
				// console.debug('updating duration', value);
				this.totalDurationInMillis = (value.totalTimeSpentInMillis ?? 0) + (Date.now() - value.enterTimestamp);
				this.duration$$.next(this.totalDurationInMillis);
				const goldEarnedPerMinuteValue = (value.goldEarned / this.totalDurationInMillis) * 60000;
				this.goldEarnedPerMinute$$.next(Math.round(goldEarnedPerMinuteValue));
			}, 800);
		}
	}

	isOverview!: boolean;
	title!: string;
	goldEarned!: number | null;

	private duration$$ = new BehaviorSubject<number | null>(null);
	private goldEarnedPerMinute$$ = new BehaviorSubject<number>(0);

	private totalDurationInMillis = 0;
	private durationInterval: any;

	constructor(protected override readonly cdr: ChangeDetectorRef) {
		super(cdr);
	}

	ngAfterContentInit(): void {
		this.duration$ = this.duration$$.asObservable().pipe(this.mapData((duration) => formatDuration(duration)));
		this.goldEarnedPerMinute$ = this.goldEarnedPerMinute$$
			.asObservable()
			.pipe(this.mapData((duration) => `${duration.toFixed(0)} / min`));
	}

	override ngOnDestroy(): void {
		super.ngOnDestroy();
		if (this.durationInterval) {
			clearInterval(this.durationInterval);
		}
	}
}

const formatDuration = (milliseconds: number | null): string | null => {
	if (milliseconds == null) {
		return null;
	}

	const date = new Date(milliseconds);
	const hours = date.getUTCHours() > 0 ? String(date.getUTCHours()).padStart(2, '0') + ':' : '';
	const minutes = String(date.getUTCMinutes()).padStart(2, '0') + ':';
	const seconds = String(date.getUTCSeconds()).padStart(2, '0');
	return `${hours}${minutes}${seconds}`;
};
