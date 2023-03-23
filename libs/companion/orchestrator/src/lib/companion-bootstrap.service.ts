import { Injectable } from '@angular/core';

@Injectable()
export class CompanionBootstrapService {
	public async init(): Promise<boolean> {
		return true;
	}
}
