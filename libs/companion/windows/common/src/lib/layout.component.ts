import { AfterContentInit, Component, Input } from '@angular/core';
import { OverwolfService } from '@main-app/companion/common';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from './navigation/navigation-view.component';

@Component({
	selector: 'main-app-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements AfterContentInit {
	@Input() menuItems!: readonly MenuItem[];
	@Input() selectedModule: string | undefined;

	private windowId$$ = new BehaviorSubject<string | undefined>(undefined);

	constructor(private readonly ow: OverwolfService) {}

	async ngAfterContentInit(): Promise<void> {
		const currentWindow = await this.ow.getCurrentWindow();
		this.windowId$$.next(currentWindow?.id);
	}

	async dragResize(event: MouseEvent, edge: string) {
		if (!this.windowId$$.value) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();
		await this.ow.dragResize(this.windowId$$.value, edge as overwolf.windows.enums.WindowDragEdge);
	}
}
