/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

declare const FB: any;
declare const gapi: any;

export abstract class SocialLogin {
   ready = false;
   protected lang: string;

   constructor() {
      const lang = localStorage.getItem('lang') || 'en';
      this.lang = lang === 'th' ? 'th-TH' : 'en-US';
   }

   protected loadScript(id: string, src: string): boolean {
      if (document.getElementById(id)) {
         return true;
      }
      const script = document.createElement('script');
      script.id = id;
      script.src = src;
      script.async = true;
      script.defer = true;
      script.setAttribute('crossorigin', 'anonymous');
      document.head.appendChild(script);
      return false;
   }

   abstract init(): void;
   abstract login(): Observable<any>;
   abstract logout(): void;
}

@Injectable()
export class Facebook extends SocialLogin {
   constructor() {
      super();
      (window as any).fbAsyncInit = this.fbAsyncInit.bind(this);
   }

   fbAsyncInit(): void {
      FB.init({
         appId: '2108740459404299',
         cookie: true,
         xfbml: true,
         version: 'v9.0'
      });
      this.ready = true;
   }

   init(): void {
      this.ready = this.loadScript('facebook', `https://connect.facebook.net/${this.lang}/sdk.js`);
   }

   login(): Observable<any> {
      return new Observable<any>(observer => {
         FB.getLoginStatus((resp: any) => {
            if (resp.status === 'connected') {
               this.getProfile(resp.authResponse.accessToken, observer);
            } else {
               FB.login((resp2: any) => {
                  if (resp2.status === 'connected') {
                     this.getProfile(resp2.authResponse.accessToken, observer);
                  } else {
                     observer.error('Login failed');
                  }
               }, { scope: 'public_profile,email' });
            }
         });
      });
   }

   logout(): void {
      FB.logout();
   }

   private getProfile(accessToken: string, observer: any): void {
      FB.api('/me?fields=first_name,last_name,email', (resp: any) => {
         if (resp.email) {
            const user = {
               accessToken,
               email: resp.email,
               firstName: resp.first_name,
               lastName: resp.last_name,
               avatar: 'https://graph.facebook.com/' + resp.id + '/picture?type=normal'
            };
            observer.next(user);
         } else {
            FB.logout();
            observer.error('Please grant access to your email address');
         }
      });
   }
}

@Injectable()
export class Google extends SocialLogin {
   constructor() {
      super();
      // eslint-disable-next-line no-underscore-dangle
      (window as any).___gcfg = { lang: this.lang };
      (window as any).googleInit = this.googleInit.bind(this);
   }

   googleInit(): void {
      gapi.load('auth2', () => {
         const auth2 = gapi.auth2.getAuthInstance();
         if (!auth2) {
            gapi.auth2.init({
               client_id: '873941617423-1v8m10hnrjil7c08ct8e2cnisa3pq826.apps.googleusercontent.com',
               scope: 'email'
            });
         }
         this.ready = true;
      });
   }

   init(): void {
      this.ready = this.loadScript('google', 'https://apis.google.com/js/platform.js?onload=googleInit');
   }

   login(): Observable<any> {
      const auth2 = gapi.auth2.getAuthInstance();
      return new Observable<any>(observer => {
         if (auth2.isSignedIn.get()) {
            this.getProfile(auth2, observer);
         } else {
            auth2.signIn().then(() => this.getProfile(auth2, observer));
         }
      });
   }

   logout(): void {
      gapi.auth2.getAuthInstance().disconnect();
   }

   private getProfile(auth2: any, observer: any): void {
      const user = auth2.currentUser.get();
      const profile = user.getBasicProfile();
      if (profile.getEmail()) {
         observer.next({
            accessToken: user.getAuthResponse(true).access_token,
            email: profile.getEmail(),
            firstName: profile.getGivenName(),
            lastName: profile.getFamilyName(),
            avatar: profile.getImageUrl()
         });
      } else {
         auth2.signOut();
         observer.error('Please grant access to your email address');
      }
   }
}
