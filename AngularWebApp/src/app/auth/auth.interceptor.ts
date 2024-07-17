import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
    let authReq = req;

    if (authToken && !this.authService.isAccessTokenExpired()) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError(error => {
        if (error.status === 401 && !this.authService.isRefreshTokenExpired()) {
          return this.handle401Error(authReq, next);
        } else if (error.status === 401) {
          // Only logout if the error is due to authentication issues
          this.authService.logout();
          return throwError(() => error);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refreshToken().pipe(
      switchMap((tokenResponse: any) => {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${tokenResponse.token}`
          }
        });
        return next.handle(authReq);
      }),
      catchError((error) => {
        this.authService.logout();
        return throwError(() => error);
      })
    );
  }
}
