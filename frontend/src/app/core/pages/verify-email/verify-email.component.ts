import { CommonModule } from '@angular/common'
import { Component, OnInit, inject } from '@angular/core'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { AuthHelperService } from '../../utils/auth-helper.service'
import { ToastService } from '@utils/toast.service'
import { ThemeService } from '@utils/theme.service'

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private fb = inject(FormBuilder)
  private authHelper = inject(AuthHelperService)
  private toastService = inject(ToastService)
  public themeService = inject(ThemeService)

  token: string | null = null
  userEmail: string | null = null
  status: string | null = null

  isVerifying = false
  isSuccess = false
  isError = false
  errorMessage = ''
  successMessage = ''

  isResending = false
  resendSent = false
  resendError = ''

  resendForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  })

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token')
    this.userEmail = this.route.snapshot.queryParamMap.get('email')
    this.status = this.route.snapshot.queryParamMap.get('status')

    if (this.userEmail) {
      this.resendForm.patchValue({ email: this.userEmail })
    }

    if (this.token) {
      this.verifyToken(this.token)
    }
  }

  verifyToken(token: string): void {
    this.isVerifying = true
    this.isSuccess = false
    this.isError = false
    this.errorMessage = ''

    this.authHelper.verifyEmail(token).subscribe({
      next: (message) => {
        this.isVerifying = false
        this.isSuccess = true
        this.successMessage = message || 'Votre compte a été activé avec succès !'
        this.toastService.showSuccess(this.successMessage)
      },
      error: (err) => {
        this.isVerifying = false
        this.isError = true
        this.errorMessage =
          err?.error?.message ||
          'Le lien de validation est invalide ou a expiré. Veuillez demander un nouveau lien.'
        this.toastService.showError(this.errorMessage)
      },
    })
  }

  onResendSubmit(): void {
    if (this.resendForm.invalid) {
      this.resendForm.markAllAsTouched()
      return
    }

    this.isResending = true
    this.resendError = ''
    this.resendSent = false
    const email = this.resendForm.value.email

    this.authHelper.resendVerification(email).subscribe({
      next: (message) => {
        this.isResending = false
        this.resendSent = true
        this.toastService.showSuccess(message || 'Email de confirmation envoyé !')
      },
      error: (err) => {
        this.isResending = false
        this.resendError =
          err?.error?.message || "Impossible d'envoyer l'email de confirmation. Vérifiez l'adresse saisie."
        this.toastService.showError(this.resendError)
      },
    })
  }

  toggleTheme(): void {
    this.themeService.toggleTheme()
  }
}
