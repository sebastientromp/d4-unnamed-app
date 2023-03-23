import { AfterContentInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { CompanionBackgroundService } from './companion-background.service';

@Component({
	selector: 'main-app-companion-background',
	styleUrls: [],
	template: ``,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanionBackgroundComponent implements AfterContentInit {
	// TODO: init stuff in services here
	constructor(private readonly backgroundService: CompanionBackgroundService) {
		console.debug('in background');
	}

	ngAfterContentInit(): void {
		this.backgroundService.init();
	}
}
