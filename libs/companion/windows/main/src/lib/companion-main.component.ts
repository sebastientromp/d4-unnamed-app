import { AfterContentInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuItem } from '@main-app/companion/windows/common';
import { Observable, from, map } from 'rxjs';

@Component({
	selector: 'main-app-companion-main',
	styleUrls: [],
	templateUrl: `./companion-main.component.html`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanionMainComponent implements AfterContentInit {
	currentModule$!: Observable<string>;

	menuItems: readonly MenuItem[] = [
		// {
		// 	id: 'encyclopedia',
		// 	iconSvg: 'assets/svg/encyclopedia.svg',
		// 	name: 'Encyclopedia',
		// 	subItems: [{ id: 'encyclopedia-map', name: 'Map' }],
		// },
	];

	constructor() {
		console.debug('init main');
	}

	ngAfterContentInit(): void {
		this.currentModule$ = from(this.menuItems).pipe(map((item) => item.id));
	}
}
