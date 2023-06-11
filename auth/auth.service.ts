import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { Toast } from '../../shared/toast/toast';
import { AuthApi } from './auth-api';
import { RestClient } from '../../shared/rest-client';

export interface User {
   token: string;
   userName: string;
   avatar: string;
   name: string;
   email: string;
   jobTitle: string;
   role: string;
   business: Business[];
}

export interface Business {
   id: string;
   role: string;
   name: string;
   nodeRef: string;
}

export const isAdmin = (user: User): boolean => user.role === 'Admin' || user.role === 'System';
const USER_KEY = 'zdox-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
   redirectUrl: string | undefined;
   private currentAvatar: BehaviorSubject<string>;
   private currentUser: BehaviorSubject<User | null>;

   constructor(private router: Router, private api: AuthApi, private client: RestClient, private dialog: MatDialog, private toast: Toast) {
      let user: User | null = null;
      try {
         const json = localStorage.getItem(USER_KEY);
         if (json) {
            user = JSON.parse(json);
         }
      } catch (e) { }
      this.setToken(user);
      this.currentUser = new BehaviorSubject<User | null>(user);
      this.currentAvatar = new BehaviorSubject<string>(this.avatarUrl(user));
      this.client.unauthorized.subscribe(() => this.unauthorize());
   }

   get avatar(): string {
      return this.currentAvatar.value;
   }

   get user(): User | null {
      return this.currentUser.value;
   }

   logIn(username: string, password: string): Observable<User> {
      return new Observable<User>(observer => {
         this.api.login(username, password).subscribe((user: User) => {
            this.setUser(user);
            this.setCompId(user);
            observer.next(user);
            observer.complete();
            this.redirect();
         }, e => observer.error(e));
      });
   }

   socialLogin(data: any): Observable<any> {
      return this.api.loginSocial(data);
   }

   forgot(username: string): Observable<any> {
      return this.api.forgot(username);
   }

   redirect(): void {
      const url = this.redirectUrl || '/';
      this.redirectUrl = undefined;

      const extras: NavigationExtras = {
         queryParamsHandling: 'preserve',
         preserveFragment: true
      };
      setTimeout(() => this.router.navigateByUrl(url, extras));
   }

   logout(): void {
      this.router.navigate(['/login']);
      this.api.logout();
      this.setUser(null);
      this.setCompId(null);
   }

   validate(): void {
      this.api.validate().subscribe(() => { }, () => this.setUser(null));
   }

   public unauthorize(): void {
      this.setUser(null);
      if (this.router.url !== '/login') {
         this.redirectUrl = this.router.url;
         this.dialog.closeAll();
         this.toast.dismiss();
         this.router.navigate(['/login']);
      }
   }

   getFullName(): string {
      if (!this.user) { return ''; }
      return this.user.name || this.user.userName;
   }

   setUser(user: User | null): void {
      if (user) {
         localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
         localStorage.removeItem(USER_KEY);
      }
      if (this.user !== user) {
         this.setToken(user);
         this.currentUser.next(user);
         this.currentAvatar.next(this.avatarUrl(user));
      }
   }

   setCompId(user: User | null): void {
      if (!user) {
         localStorage.removeItem('position_comp');
         return;
      }

      const comp = localStorage.getItem('position_comp');
      const bus = user.business?.find((b: Business) => b.role === 'SiteManager');
      if (!comp && bus?.id) {
         localStorage.setItem('position_comp', bus.id);
      }
   }

   private avatarUrl(user: any): string {
      return user?.avatar ? this.api.getAvatarUrl(user.avatar) : 'assets/images/profile.png';
   }

   private setToken(user: any): void {
      this.client.token = user ? user.token : undefined;
   }
}
