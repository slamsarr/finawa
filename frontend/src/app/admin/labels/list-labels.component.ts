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
import { LabelService } from '@openapi/services'
import { Label, LabelCreateRequest, LabelUpdateRequest, Referential, ResponseListLabel, ResponseListReferential } from '@openapi/models'
import { ToastService } from '@utils/toast.service'


@Component({
  selector: 'app-list-labels',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule, NgbPaginationModule, AsyncPipe, RouterLink],
  templateUrl: './list-labels.component.html',
})
export class ListLabelsComponent implements OnInit {
  private labelService = inject(LabelService)
  private modalService = inject(NgbModal)
  private toastService = inject(ToastService)

  referentialTypes$: Observable<ResponseListReferential> | null = null

  selectedType: Referential | null = null
  labelList$: Observable<ResponseListLabel> | null = null
  totalElements = 0
  page = 1
  size = 10
  searchName = ''

  selectedLabel: LabelUpdateRequest | null = null
  saving = false

  ngOnInit() {
    this.referentialTypes$ = this.labelService.readAllReferentialTypes()
  }

  selectType(type: Referential) {
    this.selectedType = type
    this.searchName = ''
    this.page = 1
    this.loadLabels()
  }

  loadLabels() {
    if (!this.selectedType) return

    const searchParams: Record<string, string> = {
      referentialType: this.selectedType.type!,
    }
    if (this.searchName.trim()) {
      searchParams['name'] = this.searchName.trim()
    }

    this.labelList$ = this.labelService.readAllLabel({
      searchParams,
      pageable: { page: this.page - 1, size: this.size, sort: ['name'] },
    }).pipe(tap(res => {
      this.totalElements = res.metadata?.totalElements ?? 0
    }))
  }

  onSearch() {
    this.page = 1
    this.loadLabels()
  }

  onReset() {
    this.searchName = ''
    this.onSearch()
  }

  onPageChange(p: number) {
    this.page = p
    this.loadLabels()
  }

  backToTypes() {
    this.selectedType = null
    this.labelList$ = null
    this.totalElements = 0
  }

  openModal(content: unknown, label?: Label) {
    this.selectedLabel = label
      ? {
        description: label.description ?? '',
        id: label.id ?? 0,
        name: label.name ?? '',
        type: label.referential?.type ?? this.selectedType?.type ?? '',
      }
      : {
        description: '',
        id: 0,
        name: '',
        type: this.selectedType?.type ?? '',
      }
    this.modalService.open(content, { centered: true })
  }

  save(modal: { close: () => void }) {
    if (!this.selectedLabel?.name?.trim()) return
    this.saving = true

    let obs: Observable<any>;
    if (this.selectedLabel.id) {
      obs = this.labelService.updateLabel({
        labelId: this.selectedLabel.id,
        body: { ...this.selectedLabel },
      })
    } else {
      const body: LabelCreateRequest = {
        description: this.selectedLabel.description,
        name: this.selectedLabel.name,
        type: this.selectedLabel.type || this.selectedType?.type || '',
      }
      obs = this.labelService.createLabel({
        body: body,
      })
    }

    obs.subscribe({
      next: () => {
        this.saving = false
        modal.close()
        this.toastService.showMessage('Label enregistré avec succès!', 'success')
        this.loadLabels()
      },
      error: (err: { error?: { message?: string } }) => {
        this.saving = false
        this.toastService.showMessage(err?.error?.message || 'Erreur lors de l\'enregistrement', 'error')
      },
    })
  }

  confirmDelete(content: unknown, label: Label) {
    // this.selectedLabel = label
    this.modalService.open(content, { centered: true, size: 'sm' }).result.then(
      () => this.labelService
        .deleteLabel({ labelId: label.id! })
        .subscribe({
          next: () => {
            this.toastService.showSuccess('Label supprimé avec succès !')
            this.loadLabels()
          },
        }),
      () => { },
    )
  }

  typeLabel(type: Referential): string {
    return type.label!;
    // return REFERENTIAL_TYPE_LABELS[type] ?? type
    //   .replace(/_/g, ' ')
    //   .toLowerCase()
    //   .replace(/\b\w/g, l => l.toUpperCase())
  }
}
