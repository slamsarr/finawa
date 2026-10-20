import { Component, OnInit, inject } from '@angular/core'
import { AsyncPipe, CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import {
  NgbModal,
  NgbModalModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap'
import { Observable, tap } from 'rxjs'
import { EnterpriseService, LabelService } from '@openapi/services'
import {
  Enterprise,
  ResponseListEnterprise,
  ResponseListLabel,
  EnterpriseUpdateRequest,
} from '@openapi/models'
import { ToastService } from '@utils/toast.service'

@Component({
  selector: 'app-list-enterprises',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModalModule,
    NgbPaginationModule,
    AsyncPipe,
    RouterLink,
  ],
  templateUrl: './list-enterprises.component.html',
})
export class ListEnterprisesComponent implements OnInit {
  private enterpriseService = inject(EnterpriseService)
  private labelService = inject(LabelService)
  private modalService = inject(NgbModal)
  private toastService = inject(ToastService)

  enterprises$: Observable<ResponseListEnterprise> | null = null
  sectors$: Observable<ResponseListLabel> | null = null
  types$: Observable<ResponseListLabel> | null = null

  totalElements = 0
  page = 1
  size = 10

  // Filters
  searchName = ''
  searchUser = ''
  searchRegion = ''
  selectedSectorId = 0
  selectedTypeId = 0

  // Modals & forms
  selectedEnterprise: Enterprise | null = null
  editForm: EnterpriseUpdateRequest = {
    id: 0,
    name: '',
    summary: '',
    region: '',
    annualTurnover: 0,
    employeeCount: 1,
    creationDate: '',
    sectorId: 0,
    typeId: 0,
  }
  saving = false
  enterpriseToDelete: Enterprise | null = null

  readonly regions: string[] = [
    'Dakar',
    'Thiès',
    'Saint-Louis',
    'Diourbel',
    'Fatick',
    'Kaolack',
    'Kolda',
    'Louga',
    'Matam',
    'Sédhiou',
    'Tambacounda',
    'Kédougou',
    'Kaffrine',
    'Ziguinchor',
  ]

  ngOnInit() {
    this.loadReferentials()
    this.load()
  }

  loadReferentials() {
    this.sectors$ = this.labelService.readAllLabel({
      searchParams: { referentialType: 'ENTERPRISE_SECTOR' },
      pageable: { page: 0, size: 100, sort: ['name'] },
    })

    this.types$ = this.labelService.readAllLabel({
      searchParams: { referentialType: 'ENTERPRISE_TYPE' },
      pageable: { page: 0, size: 100, sort: ['name'] },
    })
  }

  load() {
    const searchParams: Record<string, string> = {}
    if (this.searchName.trim()) searchParams['name'] = this.searchName.trim()
    if (this.searchUser.trim()) searchParams['user'] = this.searchUser.trim()
    if (this.searchRegion.trim()) searchParams['region'] = this.searchRegion.trim()
    if (this.selectedSectorId > 0) searchParams['sectorId'] = String(this.selectedSectorId)
    if (this.selectedTypeId > 0) searchParams['typeId'] = String(this.selectedTypeId)

    this.enterprises$ = this.enterpriseService
      .readAllEnterprises({
        searchParams,
        pageable: { page: this.page - 1, size: this.size, sort: ['name'] },
      })
      .pipe(
        tap(res => {
          this.totalElements = res.metadata?.totalElements ?? res.payload?.length ?? 0
        }),
      )
  }

  onSearch() {
    this.page = 1
    this.load()
  }

  onReset() {
    this.searchName = ''
    this.searchUser = ''
    this.searchRegion = ''
    this.selectedSectorId = 0
    this.selectedTypeId = 0
    this.onSearch()
  }

  onPageChange(p: number) {
    this.page = p
    this.load()
  }

  openViewModal(content: unknown, enterprise: Enterprise) {
    this.selectedEnterprise = enterprise
    this.modalService.open(content, { centered: true, size: 'lg' })
  }

  openEditModal(content: unknown, enterprise: Enterprise) {
    this.selectedEnterprise = enterprise
    let dateStr = ''
    if (enterprise.creationDate) {
      // Format as YYYY-MM-DD for date input
      dateStr = enterprise.creationDate.split('T')[0]
    }
    this.editForm = {
      id: enterprise.id,
      name: enterprise.name ?? '',
      summary: enterprise.summary ?? '',
      region: enterprise.region ?? '',
      annualTurnover: enterprise.annualTurnover ?? 0,
      employeeCount: enterprise.employeeCount ?? 1,
      creationDate: dateStr ? `${dateStr}T00:00:00` : new Date().toISOString(),
      sectorId: enterprise.sector?.id ?? 0,
      typeId: enterprise.type?.id ?? 0,
    }
    this.modalService.open(content, { centered: true, size: 'lg' })
  }

  saveEdit(modal: { close: () => void }) {
    if (
      !this.editForm.name?.trim() ||
      !this.editForm.region?.trim() ||
      !this.editForm.sectorId ||
      !this.editForm.typeId ||
      !this.editForm.id
    ) {
      return
    }

    this.saving = true
    const body: EnterpriseUpdateRequest = {
      ...this.editForm,
      name: this.editForm.name.trim(),
      summary: this.editForm.summary?.trim() || '',
      creationDate: this.editForm.creationDate?.includes('T')
        ? this.editForm.creationDate
        : `${this.editForm.creationDate}T00:00:00`,
    }

    this.enterpriseService
      .updateEnterprise({
        id: this.editForm.id,
        body,
      })
      .subscribe({
        next: () => {
          this.saving = false
          modal.close()
          this.toastService.showSuccess('Entreprise mise à jour avec succès !')
          this.load()
        },
        error: () => {
          this.saving = false
        },
      })
  }

  confirmDelete(content: unknown, enterprise: Enterprise) {
    this.enterpriseToDelete = enterprise
    this.modalService
      .open(content, { centered: true, size: 'sm' })
      .result.then(
        () => {
          if (!enterprise.id) return
          this.enterpriseService.deleteEnterprise({ id: enterprise.id }).subscribe({
            next: () => {
              this.toastService.showSuccess('Entreprise supprimée avec succès !')
              this.load()
            },
          })
        },
        () => {},
      )
  }

  formatCurrency(value?: number): string {
    if (value === undefined || value === null) return '—'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0,
    }).format(value)
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '—'
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }
}
