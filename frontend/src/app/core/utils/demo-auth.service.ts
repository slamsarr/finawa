import { Injectable } from '@angular/core'
import { LoginResponse } from '@openapi/models'

const STORAGE_KEY = 'finawa.demo.session'

export type DemoRole = {
  profile: string
  label: string
  hint: string
  login: string
  password?: string
}

@Injectable({ providedIn: 'root' })
export class DemoAuthService {
  readonly roles: DemoRole[] = [
    { profile: 'ADMINISTRATION', label: 'Administrateur', hint: 'Supervision & config', login: 'admin@finawa.com' },
    { profile: 'ENTREPRISE', label: 'Entreprise', hint: 'Dossiers & matching', login: 'entreprise@finawa.com' },
    { profile: 'FINANCEUR', label: 'Partenaire', hint: 'Demandes reçues', login: 'partenaire@finawa.com' },
    { profile: 'EXPERT', label: 'Expert', hint: 'Missions & conseil', login: 'expert@finawa.com' },
    { profile: 'ANALYSTE', label: 'Analyste', hint: 'Préqualification', login: 'analyste@finawa.com' },
  ]

  create(profile: string): LoginResponse {
    const role = this.roles.find((item) => item.profile === profile) ?? this.roles[0]
    const idMap: Record<string, number> = {
      ADMINISTRATION: 1,
      ENTREPRISE: 2,
      ANALYSTE: 3,
      FINANCEUR: 4,
      EXPERT: 5,
    }
    const id = idMap[role.profile] ?? 1
    return {
      access_token: `demo.${role.profile.toLowerCase()}`,
      user: {
        id: id,
        login: role.login,
        active: true,
        profile: { id: id, name: role.profile, description: `Profil ${role.label}` },
      },
    }
  }

  save(session: LoginResponse) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  }

  load(): LoginResponse | null {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as LoginResponse
    } catch {
      sessionStorage.removeItem(STORAGE_KEY)
      return null
    }
  }

  clear() {
    sessionStorage.removeItem(STORAGE_KEY)
  }

  isDemoToken(token?: string | null) {
    return !!token && token.startsWith('demo.')
  }
}
