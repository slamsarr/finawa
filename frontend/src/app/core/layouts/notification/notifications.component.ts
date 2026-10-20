import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import {
  NotificationDetailModalComponent,
  NotificationItem,
} from './notification-detail-modal.component'
import { TabItems } from '@layouts/topbar/data'

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  tabItems = TabItems
  activeTab = 0

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    // Initialisation si nécessaire
  }

  /**
   * Ouvre le modal avec les détails de la notification
   */
  openNotificationDetail(notification: NotificationItem): void {
    const modalRef = this.modalService.open(NotificationDetailModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: true,
    })

    // Passer les données de la notification au modal
    modalRef.componentInstance.notification = notification

    // Gérer le résultat du modal
    modalRef.result.then(
      (result) => {
        if (result === 'marked_as_read') {
          console.log('Notification marquée comme lue:', notification)
          // Ici vous pouvez ajouter la logique pour mettre à jour l'état
          // Par exemple: this.markAsRead(notification);
        }
      },
      (reason) => {
        // Modal fermé sans action
        console.log('Modal fermé:', reason)
      }
    )
  }

  /**
   * Change l'onglet actif
   */
  setActiveTab(index: number): void {
    this.activeTab = index
  }

  /**
   * Retourne la classe CSS pour le type de notification
   */
  getNotificationTypeClass(type: string): string {
    const classes: Record<string, string> = {
      success: 'text-success',
      info: 'text-info',
      warning: 'text-warning',
      danger: 'text-danger',
    }
    return classes[type] || 'text-secondary'
  }

  /**
   * Retourne la classe de background pour le type de notification
   */
  getNotificationBgClass(type: string): string {
    const classes: Record<string, string> = {
      success: 'bg-success-subtle',
      info: 'bg-info-subtle',
      warning: 'bg-warning-subtle',
      danger: 'bg-danger-subtle',
    }
    return classes[type] || 'bg-secondary-subtle'
  }
}
