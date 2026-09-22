import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input,
         HostBinding, HostListener, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { FocusMonitor, FocusableOption, FocusOrigin } from '@angular/cdk/a11y';
import { MatRipple } from '@angular/material/core';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'button[loading-button], button[loading-flat], button[loading-stroked]',
    exportAs: 'loadingButton',
    host: {
        '[attr.disabled]': 'disabled || null',
        '[class.mat-button-disabled]': 'disabled',
        class: 'mat-focus-indicator'
    },
    templateUrl: 'loading-button.html',
    styleUrls: ['loading-button.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class LoadingButton implements AfterViewInit, OnDestroy, FocusableOption {
   @Input() color?: string;
   @Input() disabled = false;
   @Input() disableRipple = false;
   @HostBinding('class.loading') loading = false;
   @ViewChild(MatRipple) ripple!: MatRipple;
   restoreDisabled?: boolean;
   private start = 0;

   constructor(private elementRef: ElementRef, private focusMonitor: FocusMonitor) {
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
