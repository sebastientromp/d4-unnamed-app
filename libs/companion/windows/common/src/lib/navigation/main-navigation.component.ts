import { Component, Input } from '@angular/core';
import { MenuItem } from './navigation-view.component';

@Component({
	selector: 'main-app-main-navigation',
	templateUrl: './main-navigation.component.html',
	styleUrls: ['./main-navigation.component.scss'],
})
export class MainNavigationComponent {
	@Input() menuItems!: readonly MenuItem[];
	@Input() selectedModule: string | undefined;
}
