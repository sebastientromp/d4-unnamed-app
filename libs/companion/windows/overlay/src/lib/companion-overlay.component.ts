import {
	AfterContentInit,
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ViewRef,
} from '@angular/core';
import { OverwolfService } from '@main-app/companion/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
	selector: 'main-app-companion-overlay',
	styleUrls: ['./companion-overlay.component.scss'],
	template: `
		<ng-container>
			<img
				*ngIf="showMap$ | async"
				class="map"
				src="https://s3.us-west-2.amazonaws.com/static.d4chaos.gg/app/reference/altar-of-lilith-map.png"
			/>
		</ng-container>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanionOverlayComponent implements AfterContentInit, AfterViewInit {
	showMap$!: Observable<boolean>;

	private windowId!: string;

	private showMap$$ = new BehaviorSubject<boolean>(false);

	constructor(private readonly ow: OverwolfService, private readonly cdr: ChangeDetectorRef) {}

	ngAfterContentInit(): void {
		this.showMap$ = this.showMap$$.asObservable();

		this.ow.addHotKeyPressedListener('live-map', () => {
			console.debug('pressed hotkey');
			this.showMap$$.next(!this.showMap$$.value);
			if (!(this.cdr as ViewRef)?.destroyed) {
				this.cdr.detectChanges();
			}
		});
	}

	async ngAfterViewInit(): Promise<void> {
		this.windowId = (await this.ow.getCurrentWindow()).id;
		this.ow.setWindowPassthrough(this.windowId);
		this.ow.addGameInfoUpdatedListener(async (res) => {
			if (res && res.resolutionChanged) {
				await this.changeWindowSize();
			}
		});
		await this.changeWindowSize();
	}

	private async changeWindowSize(): Promise<void> {
		const gameInfo = await this.ow.getRunningGameInfo();
		if (!gameInfo) {
			return;
		}
		const gameWidth = gameInfo.width;
		const gameHeight = gameInfo.height;
		const height = gameHeight;
		const width = gameWidth;
		await this.ow.changeWindowSize(this.windowId, width, height);
		// const dpi = gameInfo.logicalWidth / gameWidth;
		// const newLeft = Math.floor(dpi * 0.5 * (gameWidth - width));
		await this.ow.changeWindowPosition(this.windowId, 0, 0);
	}
}
