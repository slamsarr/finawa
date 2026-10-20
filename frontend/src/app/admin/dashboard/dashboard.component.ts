import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap'
import { NgApexchartsModule } from 'ng-apexcharts'
import { forkJoin, catchError, of } from 'rxjs'

import { Kpi } from '@/app/core/data/finawa-platform.data'
import { KpiCardComponent } from '@/app/core/common/components/finawa-ui.component'
import {
  UserService,
  EnterpriseService,
  DocumentService,
  AlertService,
  JournalService,
} from '@openapi/services'
import { Alert, Journal } from '@openapi/models'

@Component({
  selector: 'app-tableau-bord',
  standalone: true,
  imports: [
    KpiCardComponent,
    CommonModule,
    NgbNavModule,
    NgApexchartsModule,
    RouterLink,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private userService = inject(UserService)
  private enterpriseService = inject(EnterpriseService)
  private documentService = inject(DocumentService)
  private alertService = inject(AlertService)
  private journalService = inject(JournalService)

  bars = [42, 48, 60, 55, 70, 74, 66, 82, 90, 76]
  personaStats = [
    { label: 'Entrepreneurs', value: 48 },
    { label: 'Financeurs', value: 24 },
    { label: 'Experts', value: 13 },
    { label: 'Analystes/Admin', value: 15 },
  ]

  kpis: Kpi[] = [
    { label: 'Utilisateurs', value: '...', trend: 'Comptes actifs', icon: 'iconoir-community', tone: '#dd241d' },
    { label: 'Entreprises', value: '...', trend: 'Formalisées', icon: 'iconoir-building', tone: '#0f2b48' },
    { label: 'Documents', value: '...', trend: 'Fichiers gérés', icon: 'iconoir-page', tone: '#6c757d' },
    { label: 'Alertes actives', value: '...', trend: 'Notifications', icon: 'iconoir-bell', tone: '#f97316' },
  ]

  recentAlerts: Alert[] = []
  recentJournals: Journal[] = []
  loading = true

  ngOnInit() {
    this.loadStats()
  }

  loadStats() {
    this.loading = true
    forkJoin({
      users: this.userService.readAllUser({ searchParams: {}, pageable: { page: 0, size: 1 } }).pipe(catchError(() => of(null))),
      enterprises: this.enterpriseService.readAllEnterprises({ searchParams: {}, pageable: { page: 0, size: 1 } }).pipe(catchError(() => of(null))),
      documents: this.documentService.readAllDocuments({ searchParams: {}, pageable: { page: 0, size: 1 } }).pipe(catchError(() => of(null))),
      alerts: this.alertService.readAllAlerts({ searchParams: {}, pageable: { page: 0, size: 5, sort: ['date'] } }).pipe(catchError(() => of(null))),
      journals: this.journalService.readAllJournals({ searchParams: {}, pageable: { page: 0, size: 5, sort: ['creationDate'] } }).pipe(catchError(() => of(null))),
    }).subscribe(({ users, enterprises, documents, alerts, journals }) => {
      const userCount = users?.metadata?.totalElements ?? users?.payload?.length ?? 0
      const entCount = enterprises?.metadata?.totalElements ?? enterprises?.payload?.length ?? 0
      const docCount = documents?.metadata?.totalElements ?? documents?.payload?.length ?? 0
      const alertCount = alerts?.metadata?.totalElements ?? alerts?.payload?.length ?? 0

      this.kpis = [
        { label: 'Utilisateurs', value: userCount.toLocaleString('fr-FR'), trend: 'Comptes créés', icon: 'iconoir-community', tone: '#dd241d' },
        { label: 'Entreprises', value: entCount.toLocaleString('fr-FR'), trend: 'Entreprises inscrites', icon: 'iconoir-building', tone: '#0f2b48' },
        { label: 'Documents', value: docCount.toLocaleString('fr-FR'), trend: 'Fichiers enregistrés', icon: 'iconoir-page', tone: '#6c757d' },
        { label: 'Alertes actives', value: alertCount.toLocaleString('fr-FR'), trend: 'Notifications système', icon: 'iconoir-bell', tone: '#f97316' },
      ]

      this.recentAlerts = alerts?.payload ?? []
      this.recentJournals = journals?.payload ?? []
      this.loading = false
    })
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '—'
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }
}
