import {
	AfterContentInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	HostListener,
	Input,
	OnDestroy,
	ViewRef,
} from '@angular/core';
import { AppStoreUiFacadeService } from '@main-app/companion/background';
import { AbstractSubscriptionComponent, Preferences, PreferencesService } from '@main-app/companion/common';
import { Subscription, tap } from 'rxjs';

@Component({
	selector: 'preference-toggle',
	styleUrls: [`./preference-toggle.component.scss`],
	template: `
		<div class="preference-toggle" [ngClass]="{ 'toggled-on': value, 'toggled-off': value }">
			<input hidden type="checkbox" [checked]="value" name="" id="a-01-{{ field }}" (change)="toggleValue()" />
			<label class="toggle" for="a-01-{{ field }}" [ngClass]="{ enabled: value }" [helpTooltip]="tooltip">
				<p class="settings-p">
					{{ label }}
				</p>
				<b></b>
			</label>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreferenceToggleComponent extends AbstractSubscriptionComponent implements AfterContentInit, OnDestroy {
	@Input() field!: keyof Preferences;
	@Input() label!: string;
	@Input() tooltip!: string;

	value = false;

	private sub$$!: Subscription;

	constructor(
		protected override readonly cdr: ChangeDetectorRef,
		protected readonly store: AppStoreUiFacadeService,
		private readonly prefs: PreferencesService,
	) {
		super(cdr);
	}

	ngAfterContentInit() {
		this.loadDefaultValues();
		this.sub$$ = this.store
			.prefs$$()
			.pipe(
				tap((prefs) => console.debug('received prefs', prefs)),
				this.mapData((prefs) => (prefs != null ? prefs[this.field] : null)),
			)
			.subscribe((value: any) => {
				this.value = value;
				this.cdr?.detectChanges();
			});
	}

	@HostListener('window:beforeunload')
	override ngOnDestroy() {
		super.ngOnDestroy();
		this.sub$$?.unsubscribe();
	}

	async toggleValue() {
		console.debug('toggling value', this.field, this.value);
		if (this.field) {
			this.store.updatePref(this.field, !this.value);
		}
		if (!(this.cdr as ViewRef)?.destroyed) {
			this.cdr.detectChanges();
		}
	}

	private async loadDefaultValues() {
		const prefs = this.prefs.getPrefs();
		this.value = prefs[this.field];
		if (!(this.cdr as ViewRef)?.destroyed) {
			this.cdr.detectChanges();
		}
	}
}
