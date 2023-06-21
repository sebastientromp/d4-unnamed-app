import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OverwolfService } from './overwolf.service';

@Injectable()
export class AdService {
	public showAds$$ = new BehaviorSubject<boolean>(true);
	public isPremium$$ = new BehaviorSubject<boolean>(false);

	private premiumFeatures$$ = new BehaviorSubject<boolean>(false);

	constructor(private readonly ow: OverwolfService) {
		this.init();
	}

	private async init() {
		this.ow.onSubscriptionChanged(async (event) => {
			const showAds = await this.shouldDisplayAds();
			this.showAds$$.next(showAds);
		});
		this.ow.onSubscriptionChanged(async (event) => {
			const isPremium = await this.enablePremiumFeatures();
			this.premiumFeatures$$.next(isPremium);
		});
		const showAds = await this.shouldDisplayAds();
		const isPremium = await this.enablePremiumFeatures();
		this.showAds$$.next(showAds);
		this.premiumFeatures$$.next(isPremium);

		this.premiumFeatures$$.subscribe((isPremium) => {
			this.isPremium$$.next(isPremium);
		});
	}

	public async shouldDisplayAds(): Promise<boolean> {
		if (process.env['NODE_ENV'] !== 'production') {
			console.warn('not display in dev');
			return true;
		}
		return this.ow.shouldShowAds();
	}

	public async enablePremiumFeatures(): Promise<boolean> {
		if (process.env['NODE_ENV'] !== 'production') {
			console.warn('not display in dev');
			return false;
		}
		const shouldDisplayAds = await this.shouldDisplayAds();
		return !shouldDisplayAds;
	}
}
