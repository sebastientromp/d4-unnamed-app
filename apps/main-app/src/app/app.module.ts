import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CompanionOrchestratorModule } from '@main-app/companion/orchestrator';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { AppComponent } from './app.component';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		StoreModule.forRoot(
			{},
			{
				metaReducers: [],
				runtimeChecks: {
					strictActionImmutability: true,
					strictStateImmutability: true,
				},
			},
		),
		EffectsModule.forRoot([]),
		StoreRouterConnectingModule.forRoot(),

		CompanionOrchestratorModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
