import {
	AfterContentInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	HostListener,
	OnDestroy,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { OverwolfService } from '@main-app/companion/common';
import { Observable, Subject, from } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';

@Component({
	selector: 'main-app-companion-orchestrator',
	styleUrls: [],
	template: `<ng-container *ngIf="currentWindowName$ | async as currentWindowName">
		<ng-container [ngSwitch]="currentWindowName">
			<main-app-companion-background *ngSwitchCase="'BackgroundWindow'"></main-app-companion-background>
			<main-app-companion-main *ngSwitchCase="'MainWindow'"></main-app-companion-main>
			<main-app-companion-overlay *ngSwitchCase="'FullScreenOverlaysWindow'"></main-app-companion-overlay>
		</ng-container>
	</ng-container>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanionOrchestratorComponent implements AfterContentInit, OnDestroy {
	currentWindowName$!: Observable<string>;

	private destroyed$ = new Subject<void>();

	constructor(
		private readonly titleService: Title,
		private readonly cdr: ChangeDetectorRef,
		private readonly ow: OverwolfService,
	) {}

	@HostListener('window:beforeunload')
	ngOnDestroy() {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	ngAfterContentInit(): void {
		console.debug('init orchestrator');
		this.currentWindowName$ = from(this.ow.getCurrentWindow()).pipe(
			tap((currentWindow) => console.debug('current window', currentWindow)),
			map((currentWindow) => this.mapWindowName(currentWindow?.name)),
			distinctUntilChanged(),
		);
		this.currentWindowName$.subscribe((name) => {
			const humanFriendlyName = this.buildHumanFriendlyName(name);
			this.titleService.setTitle(`D4 Chaos - ${humanFriendlyName}`);
		});
	}

	private buildHumanFriendlyName(name: string): string {
		switch (name) {
			case 'BackgroundWindow':
				return 'Background';
			case 'MainOverlayWindow':
			case 'MainWindow':
				return 'Main';
			default:
				return name;
		}
	}

	private mapWindowName(name: string | undefined): string {
		switch (name) {
			case OverwolfService.MAIN_OVERLAY:
				return OverwolfService.MAIN;
			default:
				return name ?? 'Unknown window';
		}
	}
}
