import { Injectable } from '@angular/core';
import Plausible from 'plausible-tracker';

@Injectable()
export class CompanionBootstrapService {
	public async init(): Promise<boolean> {
		const plausible = Plausible({
			domain: 'd4-companion.gg-app',
			trackLocalhost: true,
			apiHost: 'https://apps.zerotoheroes.com',
		});
		plausible.trackPageview();
		return true;
	}
}
