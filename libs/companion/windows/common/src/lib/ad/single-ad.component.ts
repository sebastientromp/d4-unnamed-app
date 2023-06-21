import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	HostListener,
	Input,
	OnDestroy,
	ViewRef,
} from '@angular/core';
import { AbstractSubscriptionComponent, OverwolfService } from '@main-app/companion/common';

declare let adsReady: any;
declare let OwAd: any;

@Component({
	selector: 'single-ad',
	styleUrls: [`./single-ad.component.scss`],
	template: `
		<div class="ad-container">
			<div class="no-ads-placeholder">
				<img class="background" src="assets/images/ad-placeholder.jpg" />
				<div class="background-gradient"></div>
				<div class="content">
					<div class="text">
						<!-- <span class="main-text">Unlock Premium Features</span>
						<span class="sub-text">and remove all ads</span> -->
						<span class="main-text">Support the dev</span>
						<span class="sub-text">and remove all ads</span>
					</div>
					<button class="cta">Upgrade now</button>
				</div>
			</div>
			<div class="ads" id="ads-div-{{ this.adId }}"></div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleAdComponent extends AbstractSubscriptionComponent implements AfterViewInit, OnDestroy {
	@Input() adSize: { width: number; height: number } = { width: 400, height: 300 };

	adId = 'single-ad';

	private adRef: any;
	private adInit = false;

	constructor(protected override readonly cdr: ChangeDetectorRef, private readonly ow: OverwolfService) {
		super(cdr);
	}

	async ngAfterViewInit() {
		this.initializeAds();
	}

	@HostListener('window:beforeunload')
	override ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	private async initializeAds() {
		try {
			if (this.adInit) {
				console.log(`[ads-${this.adId}] already initializing ads, returning`);
				return;
			}
			if (!adsReady || !OwAd) {
				console.log(`[ads-${this.adId}] ads container not ready, returning`);
				setTimeout(() => {
					this.initializeAds();
				}, 1000);
				return;
			}
			if (!document.getElementById(`ads-div-${this.adId}`)) {
				console.log(`[ads-${this.adId}] ads-video not ready, returning`);
				setTimeout(() => {
					this.initializeAds();
				}, 1000);
				return;
			}
			if (!this.adRef) {
				this.adInit = true;
				console.log(`[ads-${this.adId}] first time init ads, creating OwAd`);
				this.adRef = new OwAd(document.getElementById(`ads-div-${this.adId}`), {
					size: this.adSize,
				});
				console.log(`[ads-${this.adId}] init OwAd`);
				if (!(this.cdr as ViewRef)?.destroyed) {
					this.cdr.detectChanges();
				}
				this.adInit = false;
				return;
			}
			if (!(this.cdr as ViewRef)?.destroyed) {
				this.cdr.detectChanges();
			}
		} catch (e) {
			console.warn(`[ads-${this.adId}] exception while initializing ads, retrying`, e);
			setTimeout(() => {
				this.initializeAds();
			}, 10000);
		}
	}
}
