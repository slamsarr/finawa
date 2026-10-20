import { Route } from '@angular/router'
import { LoginComponent } from './login/login.component'
import { RegisterComponent } from './register/register.component'
import { RecoverPwComponent } from './recover-pw/recover-pw.component'
import { VerifyEmailComponent } from './verify-email/verify-email.component'

export const AUTH_ROUTES: Route[] = [
  {
    path: 'log-in',
    component: LoginComponent,
    data: { title: 'Login' },
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { title: 'Register' },
  },
  {
    path: 'reset-pass',
    component: RecoverPwComponent,
    data: { title: 'Recover Password' },
  },
  {
    path: 'verify-email',
    component: VerifyEmailComponent,
    data: { title: 'Email Verification' },
  },
]
