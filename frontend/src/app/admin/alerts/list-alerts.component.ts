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
import { AlertService, LabelService, UserService } from '@openapi/services'
import { ToastService } from '@utils/toast.service'
import {
  Alert,
  ResponseListAlert,
  ResponseListLabel,
  ResponseListAdminUser,
  AlertUpdateRequest,
  AlertCreateRequest,
} from '@openapi/models'

@Component({
  selector: 'app-list-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule, NgbPaginationModule, AsyncPipe, RouterLink],
  templateUrl: './list-alerts.component.html',
})
export class ListAlertsComponent implements OnInit {
  private alertService = inject(AlertService)
  private labelService = inject(LabelService)
  private userService = inject(UserService)
  private modalService = inject(NgbModal)
  private toastService = inject(ToastService)

  alerts$: Observable<ResponseListAlert> | null = null
  priorities$: Observable<ResponseListLabel> | null = null
  users$: Observable<ResponseListAdminUser> | null = null

  totalElements = 0
  page = 1
  size = 10
  searchMessage = ''
  readFilter = ''
  priorityFilter = 0

  selectedAlertForm: {
    id?: number
    message: string
    priorityId?: number
    userLogin?: string
    read?: boolean
  } | null = null
  selectedAlertToDelete: Alert | null = null
  saving = false

  ngOnInit() {
    this.loadPriorities()
    this.loadUsers()
    this.load()
  }

  loadPriorities() {
    this.priorities$ = this.labelService.readAllLabel({
      searchParams: { referentialType: 'ALERT_PRIORITY' },
      pageable: { page: 0, size: 100, sort: ['name'] },
    })
  }

  loadUsers() {
    this.users$ = this.userService.readAllUser({
      searchParams: { active: 'true' },
      pageable: { page: 0, size: 200, sort: ['login'] },
    })
  }

  load() {
    const searchParams: Record<string, string> = {}
    if (this.searchMessage.trim()) searchParams['message'] = this.searchMessage.trim()
    if (this.readFilter) searchParams['read'] = this.readFilter
    if (this.priorityFilter > 0) searchParams['priorityId'] = String(this.priorityFilter)

    this.alerts$ = this.alertService.readAllAlerts({
      searchParams,
      pageable: { page: this.page - 1, size: this.size, sort: ['date'] },
    }).pipe(tap(res => {
      this.totalElements = res.metadata?.totalElements ?? 0
    }))
  }

  onSearch() {
    this.page = 1
    this.load()
  }

  onReset() {
    this.searchMessage = ''
    this.readFilter = ''
    this.priorityFilter = 0
    this.onSearch()
  }

  onPageChange(p: number) {
    this.page = p
    this.load()
  }

  openModal(content: unknown, alert?: Alert) {
    this.selectedAlertForm = alert
      ? {
        id: alert.id,
        message: alert.message!,
        priorityId: alert.priority?.id,
        userLogin: alert.user,
        read: alert.read,
      }
      : {
        message: '',
        priorityId: undefined,
        userLogin: undefined,
        read: false,
      }
    this.modalService.open(content, { centered: true, size: 'lg' })
  }

  save(modal: { close: () => void }) {
    if (!this.selectedAlertForm?.message?.trim() || !this.selectedAlertForm.priorityId) return
    this.saving = true

    let obs: Observable<any>
    if (this.selectedAlertForm.id) {
      const body: AlertUpdateRequest = {
        id: this.selectedAlertForm.id,
        message: this.selectedAlertForm.message.trim(),
        priorityId: this.selectedAlertForm.priorityId,
        read: !!this.selectedAlertForm.read,
      }
      obs = this.alertService.updateAlert({ body })
    } else {
      if (!this.selectedAlertForm.userLogin) return
      const body: AlertCreateRequest = {
        message: this.selectedAlertForm.message.trim(),
        priorityId: this.selectedAlertForm.priorityId,
        userLogin: this.selectedAlertForm.userLogin,
      }
      console.log("ALK:SDA:SLKD");
      console.log(body);
      obs = this.alertService.createAlert({ body })
    }

    obs.subscribe({
      next: () => {
        this.saving = false
        modal.close()
        this.toastService.showSuccess(
          this.selectedAlertForm?.id ? 'Alerte mise à jour avec succès !' : 'Alerte créée avec succès !'
        )
        this.load()
      },
      error: () => {
        this.saving = false
      },
    })
  }

  confirmDelete(content: unknown, alert: Alert) {
    this.selectedAlertToDelete = alert
    this.modalService.open(content, { centered: true, size: 'sm' }).result.then(
      () => this.alertService.deleteAlert({ alertId: alert.id! }).subscribe({
        next: () => {
          this.toastService.showSuccess('Alerte supprimée avec succès !')
          this.load()
        },
      }),
      () => { },
    )
  }
}
