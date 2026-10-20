import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { take, mergeMap, catchError, of } from "rxjs";
import { selectProfile } from "@stores/authentication/auth.selector";

export const profileGuard: CanActivateFn = (route, state) => {
  const store = inject(Store)
  const router = inject(Router)

  return store.select(selectProfile).pipe(
    take(1),
    mergeMap(profile => {
      const profileName = route.data['profile'];
      if (profile?.name === profileName) {
        return of(true);
      }
      return of(router.parseUrl('/auth/log-in'))
    }),
    catchError(() => {
      return of(router.parseUrl('/auth/log-in'))
    })
  );
};
