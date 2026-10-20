import { CommonModule } from '@angular/common'
import { Component, OnInit, inject } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'
import { selectUser } from '@stores/authentication/auth.selector'
import { EnterpriseService, LabelService, UserService } from '@openapi/services'
import { Enterprise, EnterpriseUpdateRequest, Label, UpdatePassword } from '@openapi/models'
import { ToastService } from '@utils/toast.service'
import { regions } from '@core/data/finawa-platform.data'
import {
  AvatarComponent,
  PersonaBadgeComponent,
} from '@core/common/components/finawa-ui.component'

@Component({
  selector: 'app-enterprise-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AvatarComponent, PersonaBadgeComponent],
  templateUrl: './enterprise-profile.component.html',
})
export class EnterpriseProfileComponent implements OnInit {
  private enterpriseService = inject(EnterpriseService)
  private userService = inject(UserService)
  private labelService = inject(LabelService)
  private toastService = inject(ToastService)
  private fb = inject(FormBuilder)
  private store = inject(Store)

  activeTab: 'enterprise' | 'account' = 'enterprise'
  loading = true
  saving = false
  errorMsg: string | null = null

  userLogin: string | null = null
  enterprise: Enterprise | null = null

  enterpriseTypes: Label[] = []
  enterpriseSectors: Label[] = []
  regions = regions

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    region: ['', [Validators.required]],
    typeId: [null, [Validators.required]],
    sectorId: [null, [Validators.required]],
    employeeCount: [1, [Validators.required, Validators.min(1), Validators.max(500)]],
    annualTurnover: [0, [Validators.required, Validators.min(0)]],
    creationDate: ['', [Validators.required]],
    summary: [''],
  })

  // Password Change Form
  savingPassword = false
  passwordForm: FormGroup = this.fb.group(
    {
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: (group) => {
        const p = group.get('newPassword')?.value
        const cp = group.get('confirmPassword')?.value
        return p === cp ? null : { passwordMismatch: true }
      },
    }
  )
  showOldPassword = false
  showNewPassword = false
  showConfirmPassword = false

  ngOnInit(): void {
    this.store.select(selectUser).subscribe((u) => {
      if (u) {
        this.userLogin = u.login || null
      }
    })
    this.loadData()
  }

  loadData(): void {
    this.loading = true
    this.errorMsg = null

    // Load enterprise types from LabelService
    this.labelService.readAllLabel({
      searchParams: { referentialType: 'ENTERPRISE_TYPE' },
      pageable: { page: 0, size: 100, sort: ['name'] },
    }).subscribe({
      next: (res) => {
        this.enterpriseTypes = res.payload || []
      },
    })

    // Load enterprise sectors from LabelService
    this.labelService.readAllLabel({
      searchParams: { referentialType: 'ENTERPRISE_SECTOR' },
      pageable: { page: 0, size: 100, sort: ['name'] },
    }).subscribe({
      next: (res) => {
        this.enterpriseSectors = res.payload || []
      },
    })

    // Load enterprise profile from EnterpriseService
    this.enterpriseService.getMyEnterprise().subscribe({
      next: (res) => {
        this.enterprise = res.payload || null
        if (this.enterprise) {
          let dateStr = ''
          if (this.enterprise.creationDate) {
            dateStr = this.enterprise.creationDate.substring(0, 16)
          }
          this.form.patchValue({
            name: this.enterprise.name,
            region: this.enterprise.region,
            typeId: this.enterprise.type?.id || null,
            sectorId: this.enterprise.sector?.id || null,
            employeeCount: this.enterprise.employeeCount,
            annualTurnover: this.enterprise.annualTurnover,
            creationDate: dateStr,
            summary: this.enterprise.summary,
          })
        }
        this.loading = false
      },
      error: (err) => {
        this.loading = false
        this.errorMsg =
          err?.error?.message ||
          'Impossible de charger les informations de votre entreprise. Veuillez vérifier votre connexion.'
      },
    })
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    this.saving = true
    this.errorMsg = null

    const val = this.form.value
    let formattedDate = val.creationDate
    if (formattedDate && !formattedDate.endsWith(':00')) {
      formattedDate += ':00'
    }

    const payload: EnterpriseUpdateRequest = {
      name: val.name,
      region: val.region,
      typeId: Number(val.typeId),
      sectorId: Number(val.sectorId),
      employeeCount: Number(val.employeeCount),
      annualTurnover: Number(val.annualTurnover),
      creationDate: formattedDate,
      summary: val.summary,
    }

    this.enterpriseService.updateMyEnterprise({ body: payload }).subscribe({
      next: (res) => {
        this.saving = false
        this.enterprise = res.payload || null
        this.toastService.showSuccess('Profil entreprise mis à jour avec succès !')
      },
      error: (err) => {
        this.saving = false
        const msg = err?.error?.message || "Une erreur s'est produite lors de la mise à jour."
        this.toastService.showError(msg)
      },
    })
  }

  onPasswordSubmit(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched()
      return
    }

    this.savingPassword = true
    const { oldPassword, newPassword } = this.passwordForm.value

    const payload: UpdatePassword = {
      oldPassword,
      newPassword,
    }

    this.userService.updatePassword({ body: payload }).subscribe({
      next: () => {
        this.savingPassword = false
        this.passwordForm.reset()
        this.toastService.showSuccess('Votre mot de passe a été modifié avec succès !')
      },
      error: (err) => {
        this.savingPassword = false
        const msg =
          err?.error?.message || "Impossible de mettre à jour le mot de passe. Vérifiez l'ancien mot de passe saisi."
        this.toastService.showError(msg)
      },
    })
  }
}
