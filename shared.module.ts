import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoadingButton } from './loading-button/loading-button';
import { FileSizePipe } from './file-size.pipe';
import { HilightPipe } from './hilight.pipe';
import { NumeralPipe, MoneyPipe, DecimalPipe } from './numeral.pipe';
import { PaginatorComponent } from './paginator/paginator';
import { MessageBoxComponent, MessageBox } from './message-box/message-box';
import { Toast } from './toast/toast';
import { ToastComponent } from './toast/toast.component';
import { MaskedInputComponent } from './masked-input/masked-input';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      MatButtonModule,
      MatDialogModule,
      MatIconModule,
      MatMenuModule,
      MatRippleModule,
      MatSnackBarModule,
      MatTooltipModule
   ],
   declarations: [
      LoadingButton,
      FileSizePipe,
      HilightPipe,
      NumeralPipe,
      DecimalPipe,
      MoneyPipe,
      PaginatorComponent,
      MaskedInputComponent,
      MessageBoxComponent,
      ToastComponent
   ],
   entryComponents: [
      MessageBoxComponent,
      ToastComponent
   ],
   exports: [
      LoadingButton,
      FileSizePipe,
      HilightPipe,
      NumeralPipe,
      DecimalPipe,
      MaskedInputComponent,
      PaginatorComponent,
      MessageBoxComponent,
      ToastComponent
   ],
   providers: [
      MessageBox, Toast
   ]
})
export class SharedModule { }
