import { Injectable, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { of } from 'rxjs'
import { catchError, exhaustMap, map, tap } from 'rxjs/operators'
import * as AuthActions from './auth.actions'
import { LoginRequest, LoginResponse } from '@openapi/models'
import { HttpErrorResponse } from '@angular/common/http'
import { AuthHelperService } from '../../utils/auth-helper.service'
import { DemoAuthService } from '@utils/demo-auth.service'
import { ToastService } from '@utils/toast.service'
import { dashboardPathForProfile } from '@core/data/finawa-platform.data'

@Injectable()
export class AuthenticationEffects {
  private actions$ = inject(Actions)
  private authHelper = inject(AuthHelperService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private toastService = inject(ToastService)
  private demoAuth = inject(DemoAuthService)

  login$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(AuthActions.login),
        exhaustMap((login: LoginRequest) => {
          return this.authHelper.login(login)
            .pipe(
              map((response: LoginResponse) => {
                this.toastService.showSuccess('Connexion réussie')
                return AuthActions.loginSuccess(response);
              }),
              catchError((error: HttpErrorResponse) => {
                const obj = error.error?.message;
                const message = obj && typeof obj === 'string' && obj.trim().length > 0
                  ? obj
                  : "Identifiants incorrects ou erreur de connexion";
                this.toastService.showError(message)
                return of(AuthActions.loginFailure({ message }));
              })
            )
        })
      )
  )

  loginRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap((response: LoginResponse) => {
          const returnUrl =
            this.route.snapshot.queryParams['returnUrl'] ||
            dashboardPathForProfile(response.user?.profile?.name)
          this.router.navigateByUrl(returnUrl)
        })
      ),
    { dispatch: false }
  )

  logout$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(AuthActions.logout),
        exhaustMap(() => {
          if (this.demoAuth.load()) {
            this.demoAuth.clear()
            this.router.navigate(['/'])
            this.toastService.showInfo('Déconnexion effectuée')
            return of(AuthActions.logoutSuccess())
          }
          return this.authHelper.logout()
            .pipe(
              map(() => {
                this.router.navigate(['/'])
                this.toastService.showInfo('Déconnexion effectuée')
                return AuthActions.logoutSuccess();
              }),
              catchError(() => {
                this.router.navigate(['/'])
                return of(AuthActions.logoutSuccess())
              })
            )
        })
      )
  )
}
