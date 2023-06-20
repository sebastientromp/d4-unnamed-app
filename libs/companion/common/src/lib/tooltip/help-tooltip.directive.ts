/* eslint-disable no-mixed-spaces-and-tabs */
import { ConnectedPosition, Overlay, OverlayPositionBuilder, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
	ChangeDetectorRef,
	ComponentRef,
	Directive,
	ElementRef,
	HostListener,
	Input,
	OnDestroy,
	OnInit,
	ViewRef,
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { sleep } from '../services/utils';
import { HelpTooltipComponent } from './help-tooltip.component';

@Directive({
	selector: '[helpTooltip]',
})
// See https://blog.angularindepth.com/building-tooltips-for-angular-3cdaac16d138
export class HelpTooltipDirective implements OnInit, OnDestroy {
	_text = '';

	@Input('helpTooltip') set text(value: string | SafeHtml | null) {
		if (!value || value === this._text) {
			return;
		}
		this._text = value?.toString();
		if (!this._text && this.overlayRef) {
			this.overlayRef?.detach();
		} else if (this.tooltipRef) {
			this.tooltipRef.instance.text = this._text;
		}
	}

	private tooltipPortal!: ComponentPortal<any>;
	private overlayRef!: OverlayRef;
	private positionStrategy!: PositionStrategy;
	private tooltipRef!: ComponentRef<HelpTooltipComponent> | undefined;
	private target!: ElementRef;

	constructor(
		private readonly overlayPositionBuilder: OverlayPositionBuilder,
		private readonly elementRef: ElementRef,
		private readonly overlay: Overlay,
		private readonly cdr: ChangeDetectorRef,
	) {}

	ngOnInit() {
		this.target = this.elementRef.nativeElement.querySelector('[helpTooltipTarget]') || this.elementRef;
		const positionArrays: ConnectedPosition[] = [
			{
				originX: 'center',
				originY: 'top',
				overlayX: 'center',
				overlayY: 'bottom',
			},
		];
		this.positionStrategy = this.overlayPositionBuilder
			// Create position attached to the elementRef
			.flexibleConnectedTo(this.target)
			.withFlexibleDimensions(false)
			.withPush(false)
			.withViewportMargin(10)
			.withPositions(positionArrays);
		// Connect position strategy
		this.overlayRef = this.overlay.create({
			positionStrategy: this.positionStrategy,
			scrollStrategy: this.overlay.scrollStrategies.reposition(),
		});
		if (!(this.cdr as ViewRef)?.destroyed) {
			this.cdr.detectChanges();
		}
	}

	@HostListener('window:beforeunload')
	ngOnDestroy() {
		if (this.overlayRef) {
			this.overlayRef?.detach();
		}
	}

	@HostListener('mouseenter')
	async onMouseEnter() {
		await sleep(200);
		if (!this._text) {
			return;
		}

		if (this.overlayRef) {
			this.overlayRef?.detach();
		}

		// Create tooltip portal
		this.tooltipPortal = new ComponentPortal(HelpTooltipComponent);

		// Attach tooltip portal to overlay
		try {
			this.tooltipRef = this.overlayRef.attach(this.tooltipPortal);
		} catch (e) {
			this.overlayRef?.detach();
			this.tooltipRef = this.overlayRef.attach(this.tooltipPortal);
		}

		// Pass content to tooltip component instance
		this.tooltipRef.instance.text = this._text;
		this.positionStrategy.apply();
		if (!(this.cdr as ViewRef)?.destroyed) {
			this.cdr.detectChanges();
		}
	}

	@HostListener('mouseleave')
	onMouseLeave() {
		if (this.overlayRef?.hasAttached()) {
			this.overlayRef?.detach();
			if (!(this.cdr as ViewRef)?.destroyed) {
				this.cdr.detectChanges();
			}
		}
		if (this.tooltipRef) {
			this.tooltipRef = undefined;
		}
	}

	// Hide tooltip if a scroll wheel is detected anywhere
	@HostListener('window:mousewheel')
	onMouseWheel() {
		if (this.overlayRef?.hasAttached()) {
			this.overlayRef?.detach();
			if (!(this.cdr as ViewRef)?.destroyed) {
				this.cdr.detectChanges();
			}
		}
		if (this.tooltipRef) {
			this.tooltipRef = undefined;
		}
	}
}
