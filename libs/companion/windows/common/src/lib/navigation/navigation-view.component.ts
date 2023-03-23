import { Component, Input } from '@angular/core';

@Component({
	selector: 'main-app-navigation-view',
	templateUrl: './navigation-view.component.html',
	styleUrls: ['./navigation-view.component.scss'],
})
export class NavigationViewComponent {
	@Input() menuItems!: readonly MenuItem[];
	@Input() selectedModule: string | undefined;
	@Input() showLogo: boolean | undefined;

	moduleClicked(moduleId: string): void {
		console.debug('module clicked', moduleId);
	}
}

export interface MenuItem {
	readonly id: string;
	readonly iconSvg?: string;
	readonly name: string;
	readonly subItems?: readonly MenuItem[];
}
