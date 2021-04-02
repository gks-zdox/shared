import { Component, HostBinding, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoadingButton } from '../../../shared/loading-button/loading-button';
import { Facebook, Google, SocialLogin } from '../social-login';
import { Toast } from '../../../shared/toast/toast';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.scss']
})
export class LoginComponent {
   @HostBinding() className = 'app-login';
   @ViewChild('loginButton') loginButton!: LoadingButton;
   appName = environment.appName;
   enableSignup = false;
   enableSocial = false;
   title = '';
   form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
   });

   constructor(private auth: AuthService, private fb: FormBuilder, private dialog: MatDialog, public translate: TranslateService,
               public facebook: Facebook, public google: Google, private toast: Toast, private zone: NgZone) {
      if (this.auth.user) {
         this.auth.redirect();
      }
      if (this.appName === 'sarabun') {
         this.title = 'ระบบสารบรรณอิเล็กทรอนิกส์';
      } else {
         this.enableSignup = true;
         this.enableSocial = true;
         this.facebook.init();
         this.google.init();
      }
   }

   login(): void {
      this.auth.logIn(this.form.value.username, this.form.value.password)
         .subscribe(() => { }, () => this.loginButton.reset());
   }

   forgotPassword() {
      this.dialog.open(ForgotPasswordComponent, {
         disableClose: true,
         data: this.form.value.username || ''
      });
   }

   signInWithFacebook(): void {
      this.toast.dismiss();
      this.facebook.login().subscribe(result => {
         this.loginButton.wait();
         const observer = this.auth.socialLogin(result);
         this.subscribeSocial(this.facebook, observer);
      }, e => {
         this.toast.error(e);
         this.loginButton.reset();
      });
   }

   signInWithGoogle(): void {
      this.toast.dismiss();
      this.google.login().subscribe(result => {
         this.loginButton.wait();
         const observer = this.auth.socialLogin(result);
         this.subscribeSocial(this.google, observer);
      }, e => {
         this.toast.error(e);
         this.loginButton.reset();
      });
   }

   private subscribeSocial(social: SocialLogin, observer: Observable<any>): void {
      observer.subscribe(user => {
         this.zone.run(() => this.authenticated(user));
      }, e => {
         this.toast.error(e.message);
         this.zone.run(() => {
            this.loginButton.reset();
            social.logout();
         });
      });
   }

   private authenticated(user: any): void {
      if (user.isTwoFactorLogin) {
         /*this.dialog.open(TwofactorComponent, {
            disableClose: true,
            data: {token: result.token, qrCodeUrl: result.qrCodeUrl, mode: 'login'}
         }).afterClosed().subscribe(status => {
            if (status === 200) {
               this.loggedIn(result);
            } else {
               this.loginButton.reset();
               this.busy = false;
            }
         });*/
      } else {
         this.auth.setUser(user);
         this.auth.redirect();
      }
   }
}
