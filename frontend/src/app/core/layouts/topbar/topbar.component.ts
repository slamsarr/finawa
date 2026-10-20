import { Component, EventEmitter, Output, inject } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { Store } from '@ngrx/store'
import { CommonModule } from '@angular/common'

import { selectUser } from '../../stores/authentication/auth.selector'
import { logout, login as loginAction } from '@stores/authentication/auth.actions'
import { ThemeService } from '@utils/theme.service'
import { DemoAuthService, DemoRole } from '@utils/demo-auth.service'
import { ToastService } from '@utils/toast.service'
import { dashboardPathForProfile, normalizePersona, personaColors, personaLabels } from '@core/data/finawa-platform.data'

@Component({
  selector: 'app-topbar',
  imports: [
    NgbDropdownModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './topbar.component.html',
  styles: ``,
})
export class TopbarComponent {
  store = inject(Store)
  private themeService = inject(ThemeService)
  private demoAuth = inject(DemoAuthService)
  private toastService = inject(ToastService)
  scrollY = 0
  @Output() mobileMenuButtonClicked = new EventEmitter()

  user$ = this.store.select(selectUser)
  title = 'FINAWA'
  personaColors = personaColors
  personaLabels = personaLabels
  demoRoles = this.demoAuth.roles
  normalizePersona = normalizePersona

  constructor(
    private readonly modalService: NgbModal,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {
    window.addEventListener('scroll', this.handleScroll, { passive: true })
    this.handleScroll()
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let route = this.activatedRoute
        while (route.firstChild) route = route.firstChild
        this.title = route.snapshot.data['title'] || 'FINAWA'
      }
    })
  }

  toggleMobileMenu() {
    this.mobileMenuButtonClicked.emit()
  }

  changeTheme() {
    this.themeService.toggleTheme()
  }

  handleScroll = () => {
    this.scrollY = window.scrollY
  }

  onLogout(event: Event) {
    event.preventDefault()
    this.store.dispatch(logout())
  }

  /** Changer de compte sans repasser par la page de login */
  switchProfile(role: DemoRole, event: Event) {
    event.preventDefault()
    if (role.password) {
      this.store.dispatch(loginAction({ login: role.login, password: role.password, rememberMe: false }))
    }
  }

  initials(login?: string): string {
    return (login || 'Utilisateur')
      .split(/[.\s_-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('')
  }

  personaName(profileName?: string): string {
    return this.personaLabels[normalizePersona(profileName)]
  }

  personaColor(profileName?: string): string {
    return this.personaColors[normalizePersona(profileName)]
  }

  dashboardPath(profileName?: string): string {
    return dashboardPathForProfile(profileName)
  }
}
