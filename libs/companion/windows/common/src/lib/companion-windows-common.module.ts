import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CompanionCommonModule } from '@main-app/companion/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ControlCloseComponent } from './controls/control-close.component';
import { LayoutComponent } from './layout.component';
import { MainNavigationComponent } from './navigation/main-navigation.component';
import { NavigationViewComponent } from './navigation/navigation-view.component';
import { TopBarComponent } from './navigation/top-bar.component';

const components = [
	LayoutComponent,
	TopBarComponent,
	NavigationViewComponent,
	MainNavigationComponent,
	ControlCloseComponent,
];
@NgModule({
	imports: [CommonModule, HttpClientModule, InlineSVGModule.forRoot(), CompanionCommonModule],
	declarations: components,
	exports: components,
})
export class CompanionWindowsCommonModule {}
