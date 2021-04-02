import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
   constructor(private auth: AuthService, private router: Router) { }

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      if (this.auth.user) {
         if (!route.data.role || route.data.role === this.auth.user.role) {
            return true;
         }
         this.router.navigate(['/']);
      } else {
         this.auth.redirectUrl = state.url;
         this.router.navigate(['/login']);
      }
      return false;
   }

   canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      return this.canActivate(route, state);
   }
}
