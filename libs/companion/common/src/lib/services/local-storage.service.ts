import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
	private cache: { [storageKey: string]: any } = {};

	public setItem(key: LocalStorageKey, value: any): void {
		this.cache[key.toString()] = value;
		localStorage.setItem(key, JSON.stringify(value));
	}

	public getItem<T>(key: LocalStorageKey): T {
		return this.cache[key.toString()] ?? JSON.parse(localStorage.getItem(key) as string);
	}
}

export enum LocalStorageKey {
	WIDGET_POSITIONS = 'widget-positions',
	PREFERENCES = 'preferences',
}
