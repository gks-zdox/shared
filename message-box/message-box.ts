import { Component, Inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { LoadingButton } from '../loading-button/loading-button';

export interface MessageBoxTitle {
   class?: string;
   icon?: string;
   text: string;
}

export interface MessageBoxButton {
   color?: string;
   label: string;
}

export interface MessageBoxData {
   title?: MessageBoxTitle | string;
   message: string;
   accept?: MessageBoxButton | string;
   close?: string;
   action?: (dialogRef: MatDialogRef<MessageBoxComponent>) => boolean;
   observable?: Observable<any>;
   complete?: (result: any) => void;
   error?: (error: any) => void;
}

@Component({
   selector: 'app-message-box',
   templateUrl: './message-box.html',
   styleUrls: ['./message-box.scss']
})
export class MessageBoxComponent {
   titleClass: string;
   titleIcon: string;
   titleText: string;
   acceptColor: string;
   acceptLabel: string;

   constructor(private dialogRef: MatDialogRef<MessageBoxComponent>,
               @Inject(MAT_DIALOG_DATA) public options: MessageBoxData) {
      this.titleClass = typeof this.options.title === 'string' ? '' : this.options.title?.class || '';
      this.titleIcon = typeof this.options.title === 'string' ? '' : this.options.title?.icon || '';
      this.titleText = typeof this.options.title === 'string' ? this.options.title : this.options.title?.text || '';
      this.acceptColor = typeof this.options.accept === 'string' ? '' : this.options.accept?.color || '';
      this.acceptLabel = typeof this.options.accept === 'string' ? this.options.accept : this.options.accept?.label || '';
   }

   accept(button: LoadingButton): void {
      if (this.options.observable) {
         this.options.observable.subscribe((result: any) => {
            if (this.options.complete) {
               this.options.complete(result);
            }
            this.dialogRef.close(result || true);
         }, (error: any) => {
            if(this.options.error) {
               this.options.error(error);
            }
         }).add(() => button.reset());
      } else if (this.options.action) {
         if (this.options.action(this.dialogRef) === false) {
            button.reset();
         } else {
            this.dialogRef.close();
         }
      } else {
         this.dialogRef.close(true);
      }
   }

   close(): void {
      this.dialogRef.close();
   }
}

@Injectable()
export class MessageBox {
   constructor(private dialog: MatDialog) { }

   open(options: MessageBoxData): MatDialogRef<MessageBoxComponent> {
      return this.dialog.open(MessageBoxComponent, { disableClose: true, data: options });
   }
}
