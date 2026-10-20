import { Injectable, inject } from '@angular/core'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
} from '@angular/common/http'
import { catchError, mergeMap, Observable, switchMap, take, throwError } from 'rxjs'
import { AuthHelperService } from '@utils/auth-helper.service'
import { DemoAuthService } from '@utils/demo-auth.service'
import * as AuthSelectors from '@stores/authentication/auth.selector'
import * as AuthActions from '@stores/authentication/auth.actions'


// TODO : Maybe this is not optimal for the case of multiple requests at the same time
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private store = inject(Store)
  private router = inject(Router)
  private authHelper = inject(AuthHelperService)
  private demoAuth = inject(DemoAuthService)

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request = request.clone({ withCredentials: true })
    if (request.url.includes('/refresh')) {
      return next.handle(request);
    }
    return this.store.select(AuthSelectors.selectAccessToken)
      .pipe(
        take(1),
        mergeMap(token => {
          let req = request.clone();
          if (token !== null && token!.trim().length > 0) {
            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`,
              },
            })
          }
          return next.handle(req)
            .pipe(
              catchError((error: HttpErrorResponse) => {
                // Catch errors of type 401(Unauthorized)
                if (error.status === 401 && !this.demoAuth.isDemoToken(token)) {
                  // We send a refresh call
                  return this.authHelper.refresh()
                    .pipe(
                      take(1),
                      switchMap((response) => {
                        const newToken = response.access_token!
                        // We update the store and retry the original request with the new accessToken
                        this.store.dispatch(AuthActions.refreshSuccess(response))
                        let retryRequest = request.clone({
                          setHeaders: {
                            Authorization: `Bearer ${newToken}`,
                          }
                        })
                        return next.handle(retryRequest);
                      }),
                      catchError(() => {
                        this.store.dispatch(AuthActions.logout())
                        this.router.navigate(['/auth/log-in'])
                        return throwError(() => error)
                      })
                    )
                }
                return throwError(() => error)
              })
            )
        })
      )
  }
}

export const JwtInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor,
  multi: true,
}
