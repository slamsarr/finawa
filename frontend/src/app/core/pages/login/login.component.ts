import { login as loginAction, loginSuccess } from '@stores/authentication/auth.actions'
import { Component, OnInit, inject } from '@angular/core'
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'
import { CommonModule } from '@angular/common'
import { selectError, selectLoading } from '../../stores/authentication/auth.selector'
import { ThemeService } from '@utils/theme.service'
import { DemoAuthService, DemoRole } from '@utils/demo-auth.service'
import { ToastService } from '@utils/toast.service'

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  signInForm!: UntypedFormGroup
  submitted: boolean = false

  public fb = inject(UntypedFormBuilder)
  public store = inject(Store)
  public themeService = inject(ThemeService)
  private demoAuth = inject(DemoAuthService)
  private toast = inject(ToastService)
  loading$ = this.store.select(selectLoading)
  error$ = this.store.select(selectError)
  demoRoles = this.demoAuth.roles

  toggleTheme(): void {
    this.themeService.toggleTheme()
  }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    })

    const signUpButton = document.getElementById('signUp')
    const signInButton = document.getElementById('signIn')
    const container = document.getElementById('container')

    if (signUpButton && container) {
      signUpButton.addEventListener('click', () => {
        container.classList.add('right-panel-active')
      })
    }

    if (signInButton && container) {
      signInButton.addEventListener('click', () => {
        container.classList.remove('right-panel-active')
      })
    }
  }

  get formValues() {
    return this.signInForm.controls
  }

  togglePassword(input: HTMLInputElement) {
    input.type = input.type === 'password' ? 'text' : 'password'
  }

  getIcon(input: HTMLInputElement): any {
    return {
      off: input.type === 'password',
      on: input.type === 'text',
    }
  }

  onLogin() {
    this.submitted = true
    if (this.signInForm.valid) {
      const login = this.formValues['login'].value
      const password = this.formValues['password'].value
      const rememberMe = !!this.formValues['rememberMe']?.value
      this.store.dispatch(loginAction({ login: login, password: password, rememberMe: rememberMe }))
    }
  }

  enterDemo(role: DemoRole) {
    if (role.password) {
      this.store.dispatch(loginAction({ login: role.login, password: role.password, rememberMe: false }))
    } else {
      const session = this.demoAuth.create(role.profile)
      this.demoAuth.save(session)
      this.toast.showSuccess(`Espace ${role.label}`)
      this.store.dispatch(loginSuccess(session))
    }
  }

  fillForm(role: DemoRole, event: Event) {
    event.stopPropagation()
    this.signInForm.patchValue({
      login: role.login,
      password: role.password || 'admin-finawa@2026',
    })
    this.toast.showInfo(`Identifiants de ${role.label} pré-remplis`)
  }
}
