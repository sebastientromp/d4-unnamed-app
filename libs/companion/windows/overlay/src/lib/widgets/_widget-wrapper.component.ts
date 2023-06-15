import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { LocalStorageKey, LocalStorageService, OverwolfService } from '@main-app/companion/common';
import { Observable, UnaryFunction, map, pipe, switchMap } from 'rxjs';

// https://stackoverflow.com/questions/62222979/angular-9-decorators-on-abstract-base-class
@Directive()
export abstract class AbstractWidgetWrapperComponent {
	protected abstract defaultPositionLeftProvider: (gameWidth: number, gameHeight: number, dpi: number) => number;
	protected abstract defaultPositionTopProvider: (gameWidth: number, gameHeight: number, dpi: number) => number;
	protected widgetName!: string;

	private repositioning?: boolean;

	constructor(
		protected readonly el: ElementRef,
		protected readonly renderer: Renderer2,
		protected readonly cdr: ChangeDetectorRef,
		protected readonly ow: OverwolfService,
		protected readonly localStorage: LocalStorageService,
	) {}

	startDragging() {
		// Do nothing for now
		console.debug('start dragging');
	}

	async stopDragging() {
		// Do nothing for now
		console.debug('stop dragging');
	}

	async dragEnded(event: CdkDragEnd) {
		const newPosition = {
			x: this.el.nativeElement.querySelector('.widget')?.getBoundingClientRect().left,
			y: this.el.nativeElement.querySelector('.widget')?.getBoundingClientRect().top,
		};
		console.debug('drag ended', newPosition);
		await this.updatePosition(newPosition.x, newPosition.y);
		this.reposition(() => event.source._dragRef.reset());
	}

	@HostListener('window:window-resize')
	async onResize(): Promise<void> {
		await this.doResize();
		await this.reposition();
	}

	protected async doResize() {
		// Do nothing, only for children
	}

	protected handleReposition(): UnaryFunction<Observable<boolean>, Observable<boolean>> {
		return pipe(
			switchMap(async (visible: boolean) => {
				if (visible) {
					const repositioned = await this.reposition();
				}
				return visible;
			}),
			map((visible) => visible),
		);
	}

	protected async reposition(cleanup: (() => void) | null = null): Promise<{ left: number; top: number } | null> {
		if (this.repositioning) {
			return null;
		}
		this.repositioning = true;
		// const prefs = await this.prefs.getPreferences();
		const gameInfo = await this.ow.getRunningGameInfo();
		if (!gameInfo) {
			console.warn('missing game info', gameInfo);
			this.repositioning = false;
			return null;
		}
		const gameWidth = gameInfo.width;
		const gameHeight = gameInfo.height;
		const dpi = gameInfo.logicalWidth / gameInfo.width;

		// First position the widget based on the prefs
		let positionFromPrefs = await this.extractPosition();
		if (!positionFromPrefs) {
			positionFromPrefs = {
				left: this.defaultPositionLeftProvider(gameWidth, gameHeight, dpi),
				top: this.defaultPositionTopProvider(gameWidth, gameHeight, dpi),
			};
		}
		this.renderer.setStyle(this.el.nativeElement, 'left', positionFromPrefs.left + 'px');
		this.renderer.setStyle(this.el.nativeElement, 'top', positionFromPrefs.top + 'px');

		if (cleanup) {
			cleanup();
		}

		this.repositioning = false;
		return positionFromPrefs;
	}

	private async extractPosition(): Promise<{ left: number; top: number } | null> {
		const positions =
			this.localStorage.getItem<{ [widgetName: string]: { left: number; top: number } }>(
				LocalStorageKey.WIDGET_POSITIONS,
			) ?? {};
		return positions[this.widgetName];
	}

	private async updatePosition(left: number, top: number) {
		const positions =
			this.localStorage.getItem<{ [widgetName: string]: { left: number; top: number } }>(
				LocalStorageKey.WIDGET_POSITIONS,
			) ?? {};
		positions[this.widgetName] = { left, top };
		this.localStorage.setItem(LocalStorageKey.WIDGET_POSITIONS, positions);
	}
}
