import { Component } from '@angular/core';
import { LoadingButton } from '../../../shared/loading-button/loading-button';
import { AuthService } from '../auth.service';

@Component({
   selector: 'app-forgot-password',
   templateUrl: './forgot-password.component.html',
   styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
   step = 1;
   username = '';
   result = '';
   error = '';

   constructor(private auth: AuthService) {}

   forgot(button: LoadingButton): void {
      this.error = '';
      this.auth.forgot(this.username)
         .subscribe(result => {
            this.result = result;
            this.step = 2;
         }, e => {
            this.error = e.status === 0 ? e.message : 'Cannot reset password at this time.<br/>You have changed password recently.';
         }).add(() => button.reset());
   }
}
