import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef,
         HostBinding, HostListener, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { FocusMonitor, FocusableOption, FocusOrigin } from '@angular/cdk/a11y';
import { CanColor, CanDisable, CanDisableRipple, CanColorCtor, CanDisableCtor, CanDisableRippleCtor,
         MatRipple, mixinColor, mixinDisabled, mixinDisableRipple } from '@angular/material/core';

class LoadingButtonBase {
   constructor(public _elementRef: ElementRef) { }
}

// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
const _ButtonMixinBase: CanDisableRippleCtor & CanDisableCtor & CanColorCtor
   & typeof LoadingButtonBase = mixinColor(mixinDisabled(mixinDisableRipple(LoadingButtonBase)));

@Component({
   // eslint-disable-next-line @angular-eslint/component-selector
   selector: 'button[loading-button], button[loading-flat], button[loading-stroked]',
   exportAs: 'loadingButton',
   // eslint-disable-next-line @angular-eslint/no-host-metadata-property
   host: {
      '[attr.disabled]': 'disabled || null',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
      '[class.mat-button-disabled]': 'disabled',
      class: 'mat-focus-indicator'
   },
   templateUrl: 'loading-button.html',
   styleUrls: ['loading-button.scss'],
   // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
   inputs: ['disabled', 'disableRipple', 'color'],
   encapsulation: ViewEncapsulation.None,
   changeDetection: ChangeDetectionStrategy.OnPush
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class LoadingButton extends _ButtonMixinBase
   implements AfterViewInit, OnDestroy, CanDisable, CanColor, CanDisableRipple, FocusableOption {
   @HostBinding('class.loading') loading = false;
   @ViewChild(MatRipple) ripple!: MatRipple;
   restoreDisabled?: boolean;
   private start = 0;

   constructor(private elementRef: ElementRef, private focusMonitor: FocusMonitor) {
      super(elementRef);
      const css = this.getHostElement().hasAttribute('loading-flat') ? 'mat-flat-button' : 'mat-stroked-button';
      this.getHostElement().classList.add(css, 'mat-button-base');
   }

   @HostListener('click')
   onClick(): void {
      const form = this.elementRef.nativeElement.form;
      if (!form || form.checkValidity()) {
         this.wait();
      }
   }

   ngAfterViewInit(): void {
      this.focusMonitor.monitor(this.elementRef, true);
   }

   ngOnDestroy(): void {
      this.focusMonitor.stopMonitoring(this.elementRef);
   }

   focus(origin?: FocusOrigin, options?: FocusOptions): void {
      if (origin) {
        this.focusMonitor.focusVia(this.getHostElement(), origin, options);
      } else {
        this.getHostElement().focus(options);
      }
   }

   getHostElement(): any {
      return this.elementRef.nativeElement;
   }

   isRippleDisabled(): boolean {
      return this.disableRipple || this.disabled;
   }

   wait(): void {
      this.loading = true;
      if (this.restoreDisabled === undefined) {
         this.restoreDisabled = this.disabled;
      }
      this.disabled = true;
      this.start = new Date().getTime();
   }

   reset(): void {
      const min = 500;
      const diff = this.start + min - new Date().getTime();
      if (diff > 0) {
         setTimeout(() => this.clearState(), diff);
      } else {
         this.clearState();
      }
   }

   private clearState(): void {
      this.loading = false;
      this.disabled = this.restoreDisabled || false;
      this.restoreDisabled = undefined;
   }
}
