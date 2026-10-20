import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take, map, mergeMap, catchError, of } from 'rxjs';
import { selectIsAuthenticated } from '@stores/authentication/auth.selector';
import * as AuthActions from '@stores/authentication/auth.actions';
import { AuthHelperService } from '@utils/auth-helper.service';
import { DemoAuthService } from '@utils/demo-auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store)
  const router = inject(Router)
  const authService = inject(AuthHelperService);
  const demoAuth = inject(DemoAuthService);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    mergeMap(isAuthenticated => {
      if (isAuthenticated) {
        return of(true);
      }
      const demo = demoAuth.load()
      if (demo?.access_token) {
        store.dispatch(AuthActions.refreshSuccess(demo))
        return of(true)
      }
      return authService.refresh()
        .pipe(
          map((response) => {
            store.dispatch(AuthActions.refreshSuccess(response))
            return true;
          }),
          catchError(() => {
            return of(router.parseUrl('/auth/log-in'))
          })
        )
    })
  );
};
