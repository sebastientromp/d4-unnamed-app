import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
	selector: 'help-tooltip',
	styleUrls: [`./help-tooltip.component.scss`],
	template: `
		<div class="help-tooltip ">
			<div class="text" [innerHTML]="_text"></div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpTooltipComponent {
	@Input() set text(value: string) {
		this._text = this.sanitizer.bypassSecurityTrustHtml(`<div>${value}</div>`);
		if (!(this.cdr as ViewRef)?.destroyed) {
			this.cdr.detectChanges();
		}
	}

	_text!: SafeHtml;

	constructor(private readonly cdr: ChangeDetectorRef, private readonly sanitizer: DomSanitizer) {}
}
