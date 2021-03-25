/**
 * Created by Jew on 7/24/2017.
 */
import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders, HttpXsrfTokenExtractor } from '@angular/common/http';
import { MessageBox } from './message-box/message-box';
import { Toast } from './toast/toast';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

declare const serviceUrl: string;

@Injectable({ providedIn: 'root' })
export class RestClient {
   @Output() unauthorized = new EventEmitter();
   public token = '';
   protected url = serviceUrl;

   constructor(private http: HttpClient, private xsrfToken: HttpXsrfTokenExtractor, private msgBox: MessageBox, private toast: Toast) { }

   get<T>(api: string, options: any = {}): Observable<T> {
      return this.http.get<T>(this.getUrl(api), this.createHttpOptions(options))
         .pipe(catchError(this.handleError(api, options.alert)));
   }

   post<T>(api: string, body?: any, options: any = {}): Observable<T> {
      const isForm = body instanceof FormData;
      if ((body instanceof Object) && !isForm) {
         body = JSON.stringify(body);
      }
      return this.http.post<T>(this.getUrl(api), body, this.createHttpOptions(options, !isForm))
         .pipe(catchError(this.handleError(api, options.alert)));
   }

   put<T>(api: string, body?: any, options: any = {}): Observable<T> {
      const isForm = body instanceof FormData;
      if ((body instanceof Object) && !isForm) {
         body = JSON.stringify(body);
      }
      return this.http.put<T>(this.getUrl(api), body, this.createHttpOptions(options, !isForm))
         .pipe(catchError(this.handleError(api, options.alert)));
   }

   delete<T>(api: string, options: any = {}): Observable<T> {
      return this.http.delete<T>(this.getUrl(api), this.createHttpOptions(options))
         .pipe(catchError(this.handleError(api, options.alert)));
   }

   private getUrl(api: string): string {
      if (api.startsWith('http')) {
         return api;
      }
      return api.startsWith('/') ? `${this.url}${api}` : `${this.url}/${api}`;
   }

   private createHttpOptions(options: any, json = false): any {
      let headers: HttpHeaders = options.headers || new HttpHeaders();
      headers = headers.set('Accept-Language', localStorage.getItem('lang') || 'en');
      if (json && !headers.has('Content-Type')) {
         headers = headers.set('Content-Type', 'application/json;charset=utf-8');
      }
      if (this.token) {
         headers = headers.set('X-Auth-Token', this.token);
      }
      const xsrf = this.xsrfToken.getToken();
      if (xsrf) {
         headers = headers.set('X-XSRF-Token', xsrf);
      }
      headers = headers.set('X-Requested-With', 'XMLHttpRequest');
      options.headers = headers;
      options.withCredentials = true;
      return options;
   }

   private handleError(api: string, alert: any): any {
      return (e: any): Observable<any> => {
         let ex: any = { api, status: 0, message: undefined };
         if (e.error instanceof ArrayBuffer || e.error instanceof Blob) {
            const error = this.getError(e.error);
            if (error) { ex = error; }
         } else if (typeof e.error === 'string') {
            ex.message = e.error;
         } else if (e.error) {
            ex = e.error;
         }
         ex.api = api;
         ex.status = e.status;
         if (ex.status === 0) {
            ex.message = 'Unable to connect zDox service';
         } else if (!ex.message) {
            ex.message = `HTTP Error ${e.status} ${e.url}`;
         }
         if (e.status === 401) {
            this.unauthorized.emit(null);
            if (alert !== false && (!location.pathname.endsWith('/login') || !api.endsWith('/signin'))) {
               alert = false;
            }
         }
         if (alert === undefined || alert === 'toast') {
            this.toast.error(ex.message);
         } else if (alert === 'msgbox') {
            this.msgBox.open({
               title: { class: 'error', icon: '', text: 'Error' },
               message: ex.message,
               close: 'Close'
            });
         }
         return throwError(ex);
      };
   }

   private getError(error: ArrayBuffer | Blob): any {
      const object = error instanceof Blob ? error : new Blob([error]);
      const blobUrl = window.URL.createObjectURL(object);
      const xhr = new XMLHttpRequest();
      xhr.open('GET', blobUrl, false);
      xhr.send();
      const text = xhr.responseText;
      if (text) {
         try {
            return JSON.parse(text);
         } catch (e) { }
      }
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
   }
}
