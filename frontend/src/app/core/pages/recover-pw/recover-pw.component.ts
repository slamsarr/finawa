import { CommonModule } from '@angular/common'
import { Component, OnInit, inject } from '@angular/core'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { AuthHelperService } from '../../utils/auth-helper.service'
import { ToastService } from '@utils/toast.service'
import { ThemeService } from '@utils/theme.service'

@Component({
  selector: 'app-recover-pw',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './recover-pw.component.html',
  styleUrls: ['./recover-pw.component.scss'],
})
export class RecoverPwComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private fb = inject(FormBuilder)
  private authHelper = inject(AuthHelperService)
  private toastService = inject(ToastService)
  public themeService = inject(ThemeService)

  token: string | null = null
  isResetMode = false

  // Request Mode (Step 1: enter email)
  submittingRequest = false
  requestSent = false
  requestError = ''
  requestForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  })

  // Reset Mode (Step 2: enter new password)
  submittingReset = false
  resetSuccess = false
  resetError = ''
  resetForm: FormGroup = this.fb.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: (group) => {
        const pass = group.get('newPassword')?.value
        const confirm = group.get('confirmPassword')?.value
        return pass === confirm ? null : { passwordMismatch: true }
      },
    }
  )

  showNewPass = false
  showConfirmPass = false

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token')
    this.isResetMode = !!this.token
  }

  onRequestSubmit(): void {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched()
      return
    }

    this.submittingRequest = true
    this.requestError = ''
    this.requestSent = false
    const email = this.requestForm.value.email

    this.authHelper.forgotPassword(email).subscribe({
      next: (msg) => {
        this.submittingRequest = false
        this.requestSent = true
        this.toastService.showSuccess(msg || 'Lien de réinitialisation envoyé !')
      },
      error: (err) => {
        this.submittingRequest = false
        this.requestError =
          err?.error?.message || "Une erreur s'est produite lors de l'envoi de l'email."
        this.toastService.showError(this.requestError)
      },
    })
  }

  onResetSubmit(): void {
    if (this.resetForm.invalid || !this.token) {
      this.resetForm.markAllAsTouched()
      return
    }

    this.submittingReset = true
    this.resetError = ''
    const newPassword = this.resetForm.value.newPassword

    this.authHelper.resetPassword(this.token, newPassword).subscribe({
      next: (msg) => {
        this.submittingReset = false
        this.resetSuccess = true
        this.toastService.showSuccess(msg || 'Mot de passe mis à jour avec succès !')
      },
      error: (err) => {
        this.submittingReset = false
        this.resetError =
          err?.error?.message ||
          'Le lien de réinitialisation est invalide ou a expiré. Veuillez refaire une demande.'
        this.toastService.showError(this.resetError)
      },
    })
  }

  toggleTheme(): void {
    this.themeService.toggleTheme()
  }
}
