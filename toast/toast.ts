import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import { ToastComponent } from './toast.component';

@Injectable()
export class Toast {
   constructor(private snackBar: MatSnackBar) { }

   info(message: string, duration?: number): MatSnackBarRef<ToastComponent> {
      return this.show(message, 'info', duration);
   }

   success(message: string, duration?: number): MatSnackBarRef<ToastComponent> {
      return this.show(message, 'success', duration);
   }

   warn(message: string, duration?: number): MatSnackBarRef<ToastComponent> {
      return this.show(message, 'warn', duration);
   }

   error(message: string, duration?: number): MatSnackBarRef<ToastComponent> {
      return this.show(message, 'error', duration);
   }

   show(message: string, type?: string, duration?: number): MatSnackBarRef<ToastComponent> {
      if (duration === undefined) {
         duration = message.length * 100;
      }
      if (duration > 0 && duration < 1500) {
         duration = 1500;
      } else if (duration > 15000) {
         duration = 15000;
      }
      const config: MatSnackBarConfig = {
         data: { type, message },
         duration,
         announcementMessage: message,
         verticalPosition: 'top'
      };
      return this.snackBar.openFromComponent(ToastComponent, config);
   }

   dismiss(): void {
      this.snackBar.dismiss();
   }
}
