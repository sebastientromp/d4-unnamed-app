import { AfterContentInit, Component } from '@angular/core';
import { CompanionBootstrapService } from '@main-app/companion/orchestrator';
import { Observable, from, map, startWith } from 'rxjs';

@Component({
	selector: 'main-app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterContentInit {
	initComplete$!: Observable<boolean>;

	constructor(private readonly bootstrap: CompanionBootstrapService) {}

	ngAfterContentInit(): void {
		this.initComplete$ = from(this.bootstrap.init()).pipe(
			startWith(false),
			map((initComplete) => initComplete),
		);

	}
}
