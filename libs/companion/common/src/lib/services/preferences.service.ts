import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageKey, LocalStorageService } from './local-storage.service';

@Injectable()
export class PreferencesService {
	public prefs$$ = new BehaviorSubject<Preferences | null>(null);

	constructor(private readonly localStorage: LocalStorageService) {
		this.getPrefs();
	}

	public getPrefs(): Preferences {
		if (this.prefs$$.value) {
			return this.prefs$$.value;
		}
		const prefs = this.localStorage.getItem<Preferences>(LocalStorageKey.PREFERENCES);
		const result = prefs ? Object.assign(new Preferences(), prefs) : new Preferences();
		this.savePreferences(result);
		return result;
	}

	public setValue(field: string, pref: boolean | number | string): Preferences {
		const prefs = this.getPrefs();
		const newPrefs: Preferences = { ...prefs, [field]: pref };
		this.savePreferences(newPrefs);
		console.debug('saved prefs', newPrefs);
		return newPrefs;
	}

	private savePreferences(prefs: Preferences) {
		this.localStorage.setItem(LocalStorageKey.PREFERENCES, prefs);
		this.prefs$$.next(prefs);
	}
}

export class Preferences {
	readonly sessionTrackerOverlay: boolean = false;
}
