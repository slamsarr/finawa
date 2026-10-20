import { Injectable, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { map } from 'rxjs'
import { selectUser } from '@stores/authentication/auth.selector'
import { Persona, normalizePersona } from '@core/data/finawa-platform.data'

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private store = inject(Store)
  user$ = this.store.select(selectUser)
  persona$ = this.user$.pipe(map((user) => normalizePersona(user?.profile?.name)))

  hasPermission(permission: string) {
    return this.user$.pipe(
      map((user) => {
        const permissions = user?.profile?.permissions || []
        return permissions.some(
          (perm: any) =>
            perm?.name === 'ALL_ACCESS' ||
            perm?.code === 'ALL_ACCESS' ||
            perm?.name === permission ||
            perm?.code === permission
        )
      })
    )
  }

  hasAnyPermission(permissions: string[]) {
    return this.user$.pipe(
      map((user) => {
        const userPermissions = user?.profile?.permissions || []
        return userPermissions.some(
          (perm: any) =>
            perm?.name === 'ALL_ACCESS' ||
            perm?.code === 'ALL_ACCESS' ||
            permissions.includes(perm?.name) ||
            permissions.includes(perm?.code)
        )
      })
    )
  }

  isAdmin() {
    return this.persona$.pipe(
      map((persona) => persona === 'ADMIN' || persona === 'SUPER_ADMIN')
    )
  }

  isSuperAdmin() {
    return this.persona$.pipe(map((persona) => persona === 'SUPER_ADMIN'))
  }

  getPersonaFromProfile(profileName?: string): Persona {
    return normalizePersona(profileName)
  }
}
