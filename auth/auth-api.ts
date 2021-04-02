import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { RestClient } from '../../shared/rest-client';
import { User } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

declare const authServiceUrl: string;

@Injectable()
export class AuthApi {
   constructor(private client: RestClient) { }

   login(username: string, password: string): Observable<User> {
      const auth = btoa(username + ':' + encodeURIComponent(password));
      const headers = new HttpHeaders().set('Authorization', 'Basic ' + auth);
      return this.get('signin', { headers });
   }

   loginSocial(data: any): Observable<any> {
      return this.post(`api/social?device=Web`, data);
   }

   logout(): void {
      this.delete('signout').subscribe();
   }

   forgot(username: string): Observable<any> {
      return this.post(`api/${environment.appName}/forgotpw?u=${username}`, null, { responseType: 'text' });
   }

   validate(): Observable<any> {
      return this.get('signin', { alert: false });
   }

   getAvatarUrl(avatar: string): string {
      return `${authServiceUrl}/avatar/${avatar}?token=${this.client.token}`;
   }

   dummy(): Observable<any> {
      return this.put('something');
   }

   private get<T>(api: string, options: any = {}): Observable<T> {
      return this.client.get(`${authServiceUrl}/${api}`, options);
   }

   private post<T>(api: string, body?: any, options: any = {}): Observable<T> {
      return this.client.post(`${authServiceUrl}/${api}`, body, options);
   }

   private put<T>(api: string, body?: any, options: any = {}): Observable<T> {
      return this.client.put(`${authServiceUrl}/${api}`, body, options);
   }

   private delete<T>(api: string, options: any = {}): Observable<T> {
      return this.client.delete(`${authServiceUrl}/${api}`, options);
   }
}
