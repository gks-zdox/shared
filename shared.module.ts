import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatRippleModule } from '@angular/material/core';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
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
