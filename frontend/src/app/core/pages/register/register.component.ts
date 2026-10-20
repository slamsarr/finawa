import { CommonModule } from '@angular/common'
import { Component, OnInit, inject } from '@angular/core'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { regions, sectors } from '@core/data/finawa-platform.data'
import { ThemeService } from '@utils/theme.service'
import { ToastService } from '@utils/toast.service'
import { EnterpriseService, LabelService } from '@openapi/services'
import { EnterpriseCreateRequest, Label } from '@openapi/models'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private enterpriseService = inject(EnterpriseService)
  private labelService = inject(LabelService)
  private toastService = inject(ToastService)
  public themeService = inject(ThemeService)

  submitting = false
  errorMessage: string | null = null
  regions = regions

  enterpriseTypes: Label[] = []
  enterpriseSectors: Label[] = []

  needs = [
    'Financement',
    'Accompagnement à la formalisation',
    'Accompagnement de projet',
    'Business Plan',
    'Organisation RH',
    'Mise en place système de pilotage et de contrôle',
    'Mise en place système d’informations',
    'Structuration',
    'Digitalisation',
    'Formation',
  ]

  partnerOrigins = [
    'Plateforme directe FINAWA',
    'Site internet KAPIT',
    'Site internet FIRIFINANCE',
    'Réseaux sociaux / Partenaires',
  ]

  form: FormGroup = this.fb.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['+221 77 123 45 67', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      genre: ['Femme', [Validators.required]],
      rccm: [''],
      ninea: [''],
      typeId: [null, [Validators.required]],
      sectorId: [null, [Validators.required]],
      region: ['Dakar', [Validators.required]],
      employeeCount: [5, [Validators.required, Validators.min(1), Validators.max(500)]],
      annualTurnover: [10000000, [Validators.required, Validators.min(0)]],
      creationDate: [new Date().toISOString().substring(0, 16), [Validators.required]],
      mainNeed: ['Financement', [Validators.required]],
      partnerOrigin: ['Plateforme directe FINAWA', [Validators.required]],
      validationMethod: ['Email & OTP SMS', [Validators.required]],
      summary: [''],
    },
    {
      validators: (group) => {
        const pass = group.get('password')?.value
        const confirm = group.get('confirmPassword')?.value
        return pass === confirm ? null : { passwordMismatch: true }
      },
    }
  )

  ngOnInit(): void {
    this.applyFallbackLabels()

    this.labelService
      .readAllLabel({
        searchParams: { referentialType: 'ENTERPRISE_TYPE' },
        pageable: { page: 0, size: 100, sort: ['name'] },
      })
      .subscribe({
        next: (res) => {
          if (res.payload?.length) {
            this.enterpriseTypes = res.payload
            if (!this.form.get('typeId')?.value) {
              this.form.patchValue({ typeId: this.enterpriseTypes[0].id })
            }
          }
        },
        error: () => this.applyFallbackLabels(),
      })

    this.labelService
      .readAllLabel({
        searchParams: { referentialType: 'ENTERPRISE_SECTOR' },
        pageable: { page: 0, size: 100, sort: ['name'] },
      })
      .subscribe({
        next: (res) => {
          if (res.payload?.length) {
            this.enterpriseSectors = res.payload
            if (!this.form.get('sectorId')?.value) {
              this.form.patchValue({ sectorId: this.enterpriseSectors[0].id })
            }
          }
        },
        error: () => this.applyFallbackLabels(),
      })
  }

  private applyFallbackLabels() {
    if (!this.enterpriseTypes.length) {
      this.enterpriseTypes = [
        { id: 1, name: 'SARL' },
        { id: 2, name: 'SA' },
        { id: 3, name: 'SAS' },
        { id: 4, name: 'EI / GIE' },
        { id: 5, name: 'Coopérative' },
      ]
    }
    if (!this.enterpriseSectors.length) {
      this.enterpriseSectors = sectors.map((name, index) => ({ id: index + 1, name }))
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme()
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    this.submitting = true
    this.errorMessage = null
    const val = this.form.value

    let creationDateStr = val.creationDate || new Date().toISOString()
    if (creationDateStr.length === 16) {
      creationDateStr += ':00'
    }

    const summaryDetails = [
      val.summary ? val.summary : '',
      val.phone ? `Tél : ${val.phone}` : '',
      val.genre ? `Genre dirigeant : ${val.genre}` : '',
      val.rccm ? `RCCM : ${val.rccm}` : '',
      val.ninea ? `NINEA : ${val.ninea}` : '',
      val.mainNeed ? `Besoin principal : ${val.mainNeed}` : '',
      val.partnerOrigin ? `Canal d’inscription : ${val.partnerOrigin}` : '',
      val.validationMethod ? `Méthode validation : ${val.validationMethod}` : '',
    ]
      .filter(Boolean)
      .join(' · ')

    const payload: EnterpriseCreateRequest = {
      name: val.name,
      email: val.email,
      password: val.password,
      typeId: Number(val.typeId),
      sectorId: Number(val.sectorId),
      region: val.region,
      annualTurnover: Number(val.annualTurnover),
      employeeCount: Number(val.employeeCount),
      creationDate: creationDateStr,
      summary: summaryDetails || undefined,
    }

    this.enterpriseService.createEnterprise({ body: payload }).subscribe({
      next: () => {
        this.submitting = false
        this.toastService.showSuccess(
          'Compte créé avec succès ! Un email de confirmation vous a été envoyé.'
        )
        this.router.navigate(['/auth/verify-email'], {
          queryParams: { email: val.email, status: 'pending' },
        })
      },
      error: (err) => {
        this.submitting = false
        this.errorMessage =
          err?.error?.message || "Une erreur s'est produite lors de l'inscription de l'entreprise."
        this.toastService.showError(this.errorMessage || '')
      },
    })
  }
}
