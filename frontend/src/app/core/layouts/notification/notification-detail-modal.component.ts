import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'

export interface NotificationItem {
  time: string
  iconClass: string
  title: string
  description: string
  type: 'success' | 'info' | 'warning' | 'danger'
}

@Component({
  selector: 'app-notification-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-header border-0">
      <h5 class="modal-title">Détails de la notification</h5>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="activeModal.dismiss()"
      ></button>
    </div>
    <div class="modal-body">
      <div class="notification-detail">
        <!-- Icon Section -->
        <div class="text-center mb-4">
          <div
            class="notification-icon-container d-inline-flex align-items-center justify-content-center rounded-circle"
            [ngClass]="getIconBackgroundClass()"
          >
            <i
              [class]="notification.iconClass + ' fs-1'"
              [ngClass]="getIconColorClass()"
            ></i>
          </div>
        </div>

        <!-- Time Badge -->
        <div class="text-center mb-3">
          <span class="badge bg-secondary-subtle text-secondary">
            <i class="las la-clock me-1"></i>
            Il y a {{ notification.time }}
          </span>
        </div>

        <!-- Title -->
        <h4 class="text-center mb-3 fw-semibold">{{ notification.title }}</h4>

        <!-- Description -->
        <div class="alert" [ngClass]="getAlertClass()" role="alert">
          <div class="d-flex align-items-start">
            <i [class]="notification.iconClass + ' fs-4 me-3 mt-1'"></i>
            <div>
              <p class="mb-0">{{ notification.description }}</p>
            </div>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="card border-0 bg-light mt-3">
          <div class="card-body">
            <h6 class="card-title mb-3">Informations supplémentaires</h6>
            <div class="row g-3">
              <div class="col-6">
                <div class="d-flex align-items-center">
                  <i class="las la-tag text-muted me-2"></i>
                  <div>
                    <small class="text-muted d-block">Type</small>
                    <span class="badge" [ngClass]="getBadgeClass()">
                      {{ getTypeLabel() }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="d-flex align-items-center">
                  <i class="las la-calendar text-muted me-2"></i>
                  <div>
                    <small class="text-muted d-block">Reçue</small>
                    <strong>Il y a {{ notification.time }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer border-0">
      <button
        type="button"
        class="btn btn-secondary"
        (click)="activeModal.dismiss()"
      >
        Fermer
      </button>
      <button type="button" class="btn btn-primary" (click)="handleAction()">
        <i class="las la-check me-1"></i>
        Marquer comme lue
      </button>
    </div>
  `,
  styles: [
    `
      .notification-icon-container {
        width: 80px;
        height: 80px;
      }

      .notification-detail {
        padding: 1rem;
      }

      .modal-body {
        padding: 1.5rem;
      }

      .card {
        box-shadow: none;
      }
    `,
  ],
})
export class NotificationDetailModalComponent {
  @Input() notification!: NotificationItem

  constructor(public activeModal: NgbActiveModal) {}

  getIconBackgroundClass(): string {
    const classes: Record<string, string> = {
      success: 'bg-success-subtle',
      info: 'bg-info-subtle',
      warning: 'bg-warning-subtle',
      danger: 'bg-danger-subtle',
    }
    return classes[this.notification.type] || 'bg-secondary-subtle'
  }

  getIconColorClass(): string {
    const classes: Record<string, string> = {
      success: 'text-success',
      info: 'text-info',
      warning: 'text-warning',
      danger: 'text-danger',
    }
    return classes[this.notification.type] || 'text-secondary'
  }

  getAlertClass(): string {
    const classes: Record<string, string> = {
      success: 'alert-success',
      info: 'alert-info',
      warning: 'alert-warning',
      danger: 'alert-danger',
    }
    return classes[this.notification.type] || 'alert-secondary'
  }

  getBadgeClass(): string {
    const classes: Record<string, string> = {
      success: 'bg-success',
      info: 'bg-info',
      warning: 'bg-warning',
      danger: 'bg-danger',
    }
    return classes[this.notification.type] || 'bg-secondary'
  }

  getTypeLabel(): string {
    const labels: Record<string, string> = {
      success: 'Succès',
      info: 'Information',
      warning: 'Avertissement',
      danger: 'Urgent',
    }
    return labels[this.notification.type] || 'Standard'
  }

  handleAction(): void {
    // Ici vous pouvez ajouter la logique pour marquer comme lue
    this.activeModal.close('marked_as_read')
  }
}
