import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppCommonModule } from '../../common';
import { AuthApi } from './auth-api';
//import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { Facebook, Google } from './social-login';
//import { ResetPasswordComponent } from './reset-passowrd/reset-password.component';
//import { TwoFactorComponent } from './two-factor/two-factor.component';

const authRoutes: Routes = [
   { path: 'login', component: LoginComponent }
];

@NgModule({
   imports: [
      AppCommonModule,
      RouterModule.forChild(authRoutes)
   ],
   declarations: [
      //ChangePasswordComponent,
      ForgotPasswordComponent,
      LoginComponent,
      //ResetPasswordComponent,
      //TwoFactorComponent
   ],
   entryComponents: [
   ],
   providers: [
      AuthApi, Facebook, Google
   ]
})
export class AuthModule { }
