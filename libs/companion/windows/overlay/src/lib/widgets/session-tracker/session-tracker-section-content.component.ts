import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'session-tracker-section-content',
	styleUrls: ['./session-tracker-section-content.component.scss'],
	template: ` <div class="section">
		<div class="header">
			<div class="text">{{ title }}</div>
			<div class="time">{{ duration }}</div>
		</div>
		<div class="content">
			<div class="stat gold">
				<img class="icon" src="assets/images/gold.webp" />
				<div class="value">{{ goldEarned }}</div>
				<div class="value-per-hour">{{ goldEarnedPerMinute }}</div>
			</div>
		</div>
	</div>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionTrackerSectionContentComponent {
	@Input() title!: string;
	@Input() duration!: string | null;
	@Input() goldEarned!: number | null;
	@Input() goldEarnedPerMinute!: string | null;
}
