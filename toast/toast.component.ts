import { ChangeDetectionStrategy, Component, ElementRef, HostBinding,
         Inject, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { AnimationCurves, AnimationDurations } from '@angular/material/core';

@Component({
   selector: 'app-toast',
   templateUrl: './toast.component.html',
   styleUrls: ['./toast.component.scss'],
   encapsulation: ViewEncapsulation.None,
   preserveWhitespaces: false,
   changeDetection: ChangeDetectionStrategy.OnPush,
   animations: [
      trigger('contentFade', [
         transition(':enter', [
            style({ opacity: '0' }),
            animate(`${AnimationDurations.COMPLEX} ${AnimationCurves.STANDARD_CURVE}`)
         ])
      ])
   ]
})
export class ToastComponent extends SimpleSnackBar implements OnInit {
   @HostBinding('@contentFade') fade = true;
   icon: string;
   private readonly className: string;

   constructor(public snackBarRef: MatSnackBarRef<ToastComponent>, @Inject(MAT_SNACK_BAR_DATA) data: any,
               private elementRef: ElementRef, private renderer: Renderer2) {
      super(snackBarRef, data);
      this.className = `toast-${data.type}`;
      if (data.type === 'error') {
         this.icon = 'error';
      } else if (data.type === 'warn') {
         this.icon = 'warning';
      } else if (data.type === 'success') {
         this.icon = 'check_circle';
      } else {
         this.icon = 'info';
      }
      if (data.message) {
         data.message = data.message.replace('\n', '<br/>');
      }
   }

   ngOnInit(): void {
      const parentNode = this.findContainer();
      this.renderer.addClass(parentNode, this.className);
   }

   private findContainer(): any {
      let e = this.elementRef.nativeElement;
      while (e && e.tagName.toLowerCase() !== 'snack-bar-container') {
         e = e.parentNode;
      }
      return e;
   }
}
