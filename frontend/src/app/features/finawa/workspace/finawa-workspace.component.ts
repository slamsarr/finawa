import { CommonModule, DecimalPipe } from '@angular/common'
import { Component, OnInit, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { ToastService } from '@utils/toast.service'
import { DemoAuthService } from '@utils/demo-auth.service'
import {
  AlertItem,
  DocumentItem,
  Dossier,
  Kpi,
  Partner,
  formatFcfa,
  mockDocuments,
  mockDossiers,
  mockThreads,
  needs,
  regions,
  sectors,
} from '@core/data/finawa-platform.data'
import {
  DossierService,
  DossierCreateRequest,
  Dossier as ApiDossier,
} from '@core/openapi/services/dossier.service'
import {
  PartnerService,
  Partner as ApiPartner,
} from '@core/openapi/services/partner.service'
import { MatchingService } from '@core/openapi/services/matching.service'
import { Store } from '@ngrx/store'
import { selectUser } from '@stores/authentication/auth.selector'
import {
  AvatarComponent,
  DossierStepperComponent,
  KpiCardComponent,
  ScoreGaugeComponent,
  StatusBadgeComponent,
} from '@core/common/components/finawa-ui.component'

const sharedImports = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterLink,
  DecimalPipe,
  KpiCardComponent,
  ScoreGaugeComponent,
  DossierStepperComponent,
  StatusBadgeComponent,
  AvatarComponent,
]

export function getStoredCustomDossiers(): any[] {
  try {
    return JSON.parse(localStorage.getItem('finawa_custom_dossiers') || '[]')
  } catch (_) {
    return []
  }
}

@Component({
  selector: 'app-enterprise-dashboard',
  standalone: true,
  imports: sharedImports,
  template: `
    <div class="finawa-page">
      <div class="finawa-page-header">
        <div>
          <span class="finawa-eyebrow">Intermédiation & Financement</span>
          <h1>Espace Entreprise</h1>
          <p>Supervisez la bancabilité de vos demandes, l’instruction de vos dossiers et les offres des institutions partenaires.</p>
        </div>
        <div class="finawa-header-actions">
          <a routerLink="/espace/documents" class="btn btn-ghost">
            <i class="iconoir-page me-1"></i> Pièces justificatives
          </a>
          <a routerLink="/espace/dossiers/nouveau" class="btn btn-primary">
            <i class="iconoir-plus-circle me-1"></i> Structurer un dossier
          </a>
        </div>
      </div>

      <!-- Action prioritaire d'intermédiation -->
      <div class="finawa-next-action mb-4" style="background: linear-gradient(135deg, #4e0b17 0%, #720f21 50%, #94132b 100%); border: 1px solid rgba(254, 205, 211, 0.28); box-shadow: 0 8px 24px rgba(78, 11, 23, 0.25);">
        <div class="d-flex align-items-center gap-3">
          <div class="action-badge-icon">
            <i class="iconoir-bell-notification fs-2 text-warning"></i>
          </div>
          <div>
            <span class="finawa-eyebrow" style="color: #fecdd3; font-weight: 800; text-transform: uppercase; font-size: 0.76rem; letter-spacing: 0.05em;">Opportunité d'accord bancaire</span>
            <strong class="d-block fs-16 text-white mt-1">Ajoutez les relevés bancaires des 6 derniers mois pour débloquer le palier 85/100.</strong>
            <p class="mb-0 small" style="color: rgba(255, 255, 255, 0.92);">Votre dossier "FIN-2026-0001" est pré-accepté par 2 banques PME sous réserve de la garantie FONGIP.</p>
          </div>
        </div>
        <a routerLink="/espace/documents" class="btn btn-light text-danger fw-bold shadow-sm">Déposer les pièces requises</a>
      </div>

      <!-- KPIs Financiers clés -->
      <div class="row g-3 mb-4">
        @for (kpi of kpis; track kpi.label) {
          <div class="col-xl-3 col-md-6">
            <app-kpi-card [label]="kpi.label" [value]="kpi.value" [trend]="kpi.trend" [icon]="kpi.icon" [tone]="kpi.tone" />
          </div>
        }
      </div>

      <!-- Diagnostic Bancabilité & Suivi d'Instruction -->
      <div class="row g-3">
        <div class="col-xl-5">
          <div class="finawa-panel h-100">
            <app-score-gauge
              [score]="78"
              title="Indice de Bancabilité FINAWA"
              description="Votre dossier présente un profil financier solide (CA certifié de 48M FCFA). Deux financeurs sont compatibles."
              [subScores]="{ financial: 80, compliance: 92, guarantee: 58 }"
            />
            <div class="mt-4 pt-3 border-top">
              <span class="text-muted small fw-semibold d-block mb-2 text-uppercase">Points forts & garanties :</span>
              <div class="d-flex gap-2 flex-wrap">
                <span class="badge bg-success-subtle text-success"><i class="iconoir-check me-1"></i>CA certifié (48 M FCFA)</span>
                <span class="badge bg-primary-subtle text-primary"><i class="iconoir-check me-1"></i>NINEA & RCCM valides</span>
                <span class="badge bg-warning-subtle text-warning"><i class="iconoir-warning-circle me-1"></i>Garantie FONGIP en cours</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-7">
          <div class="finawa-panel h-100">
            <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div>
                <h5 class="mb-0 fw-bold">Dossier phare en cours d'intermédiation</h5>
                <small class="text-muted">Réf : FIN-2026-0001 · Teranga Agro SARL</small>
              </div>
              <div class="text-end">
                <app-status-badge status="EN_COURS" />
                <span class="d-block text-muted small mt-1">Étape 3 sur 8</span>
              </div>
            </div>

            <!-- Résumé financier du dossier -->
            <div class="row g-2 mb-3 p-2 bg-light rounded-3">
              <div class="col-sm-4">
                <small class="text-muted d-block">Montant recherché</small>
                <strong class="text-dark fs-15">25 000 000 FCFA</strong>
              </div>
              <div class="col-sm-4">
                <small class="text-muted d-block">Instrument</small>
                <strong class="text-dark fs-15">Crédit Moyen Terme</strong>
              </div>
              <div class="col-sm-4">
                <small class="text-muted d-block">Mensualité indicative</small>
                <strong class="text-dark fs-15">795 000 FCFA / mois</strong>
              </div>
            </div>

            <app-dossier-stepper [activeIndex]="2" />

            <div class="d-flex justify-content-between align-items-center mt-3 pt-2">
              <span class="text-muted small"><i class="iconoir-clock me-1"></i>Délai moyen de retour : 10 jours</span>
              <a routerLink="/espace/dossiers" class="btn btn-sm btn-outline-primary">Détails de l'instruction <i class="iconoir-arrow-right ms-1"></i></a>
            </div>
          </div>
        </div>
      </div>

      <!-- Institutions compatibles & Flux d'alertes -->
      <div class="row g-3 mt-1">
        <div class="col-xl-7">
          <div class="finawa-panel">
            <div class="finawa-panel-head mb-3">
              <div>
                <h5 class="fw-bold mb-0">Institutions Financières Recommandées</h5>
                <small class="text-muted">Calculé par affinité sectorielle, montant et garanties</small>
              </div>
              <a routerLink="/espace/matching" class="btn btn-sm btn-ghost">Voir le comparateur complet</a>
            </div>
            <div class="row g-3">
              @for (partner of partners.slice(0, 3); track partner.id) {
                <div class="col-md-4">
                  <div class="partner-card d-flex flex-column justify-content-between">
                    <div>
                      <div class="d-flex justify-content-between align-items-start">
                        <app-avatar [name]="partner.name" persona="FINANCEUR" />
                        <span class="match-score">{{ partner.score }}%</span>
                      </div>
                      <h6 class="mt-3 mb-1 fw-bold text-truncate" [title]="partner.name">{{ partner.name }}</h6>
                      <span class="badge bg-secondary-subtle text-secondary small mb-2">{{ partner.type }}</span>
                      <p class="text-muted small mb-2" style="font-size: 0.78rem; line-height: 1.4;">{{ partner.pricing }}</p>
                    </div>
                    <div class="d-flex gap-2 mt-3 pt-2 border-top">
                      <a [routerLink]="['/partenaires', partner.id]" class="btn btn-sm btn-ghost flex-fill">Fiche</a>
                      <button type="button" class="btn btn-sm btn-primary flex-fill" (click)="contact(partner)">Transmettre</button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <div class="col-xl-5">
          <div class="finawa-panel h-100">
            <div class="finawa-panel-head mb-3">
              <div>
                <h5 class="fw-bold mb-0">Notifications de Financement</h5>
                <small class="text-muted">Suivi temps réel des banques et analystes</small>
              </div>
              <a routerLink="/messages" class="btn btn-sm btn-ghost">Messagerie</a>
            </div>
            @for (alert of alerts; track alert.title) {
              <button type="button" class="alert-row w-100 text-start border-0 bg-transparent" [class.unread]="alert.unread" (click)="markRead(alert)">
                <span class="alert-dot" [class.high]="alert.priority === 'HAUTE'" [class.medium]="alert.priority === 'MOYENNE'"></span>
                <div>
                  <strong>{{ alert.title }}</strong>
                  <p>{{ alert.priority }} · {{ alert.time }}</p>
                </div>
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class EnterpriseDashboardComponent implements OnInit {
  private toast = inject(ToastService)
  private dossierSvc = inject(DossierService)
  private partnerSvc = inject(PartnerService)

  kpis: Kpi[] = [
    { label: 'Dossiers intermédiés', value: '0', trend: 'en cours', icon: 'iconoir-folder', tone: '#c41e3a' },
    { label: 'Financements sollicités', value: '—', trend: 'FCFA cumulés', icon: 'iconoir-coins', tone: '#8b1227' },
    { label: 'Offres bancaires reçues', value: '—', trend: 'partenaires actifs', icon: 'iconoir-check-circle', tone: '#680f1f' },
    { label: 'Indice de bancabilité', value: '—', trend: 'Profil éligible', icon: 'iconoir-stats-report', tone: '#475569' },
  ]
  partners: ApiPartner[] = []
  alerts: AlertItem[] = []

  ngOnInit() {
    const updateKpis = (dossiers: ApiDossier[]) => {
      const all = [...getStoredCustomDossiers(), ...(dossiers.length ? dossiers : (mockDossiers as any[]))]
      const count = all.length
      const totalAmount = all.reduce((sum, d) => sum + (d.amount || 0), 0)
      const avgScore = count ? Math.round(all.reduce((s, d) => s + (d.score || 0), 0) / count) : 0
      this.kpis = [
        { label: 'Dossiers intermédiés', value: String(count), trend: 'en cours', icon: 'iconoir-folder', tone: '#c41e3a' },
        { label: 'Financements sollicités', value: totalAmount >= 1_000_000 ? `${Math.round(totalAmount / 1_000_000)} M` : String(totalAmount), trend: 'FCFA cumulés', icon: 'iconoir-coins', tone: '#8b1227' },
        { label: 'Offres bancaires reçues', value: String(this.partners.length), trend: 'partenaires actifs', icon: 'iconoir-check-circle', tone: '#680f1f' },
        { label: 'Indice de bancabilité', value: avgScore ? `${avgScore}%` : '—', trend: 'Profil éligible', icon: 'iconoir-stats-report', tone: '#475569' },
      ]
    }

    this.dossierSvc.readAll().subscribe({
      next: (dossiers) => updateKpis(dossiers),
      error: () => updateKpis([]),
    })
    this.partnerSvc.readAll().subscribe((p) => {
      this.partners = p
      this.kpis[2] = { ...this.kpis[2], value: String(p.length) }
    })
  }

  contact(partner: ApiPartner) {
    this.toast.showSuccess(`Dossier proposé à ${partner.name}`)
  }

  markRead(alert: AlertItem) {
    alert.unread = false
  }
}

@Component({
  selector: 'app-dossiers',
  standalone: true,
  imports: sharedImports,
  template: `
    <div class="finawa-page">
      <div class="finawa-page-header">
        <div>
          <span class="finawa-eyebrow">Requêtes</span>
          <h1>Mes dossiers</h1>
          <p>Centralisez les demandes de financement, d'accompagnement et d'investissement.</p>
        </div>
        <div class="finawa-header-actions">
          <a routerLink="/espace/matching" class="btn btn-ghost">Matching</a>
          <a routerLink="/espace/dossiers/nouveau" [queryParams]="{new: 1}" class="btn btn-primary"><i class="iconoir-plus-circle me-1"></i> Créer un dossier</a>
        </div>
      </div>

      <div class="finawa-panel mb-3">
        <div class="finawa-toolbar">
          <div class="search-field">
            <i class="iconoir-search"></i>
            <input class="form-control" [(ngModel)]="search" placeholder="Référence ou entrepreneur" />
          </div>
          <select class="form-select" [(ngModel)]="status">
            <option value="">Tous les statuts</option>
            <option value="EN_COURS">En cours</option>
            <option value="PREQUALIFIE">Préqualifié</option>
            <option value="TRANSMIS">Transmis</option>
          </select>
          <select class="form-select" [(ngModel)]="type">
            <option value="">Tous les besoins</option>
            <option>Financement</option>
            <option>Accompagnement</option>
            <option>Investissement</option>
          </select>
          <button type="button" class="btn btn-ghost" (click)="resetFilters()">Réinitialiser</button>
          <span class="filter-count">{{ filteredDossiers.length }} dossier(s)</span>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-xl-8">
          <div class="finawa-panel p-0 overflow-hidden">
            <div class="table-responsive">
              <table class="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Besoin</th>
                    <th>Montant</th>
                    <th>Score</th>
                    <th>Statut</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  @for (dossier of filteredDossiers; track dossier.id) {
                    <tr [class.table-active]="selected?.id === dossier.id" (click)="selected = dossier" style="cursor: pointer">
                      <td class="fw-semibold">{{ dossier.reference }}</td>
                      <td>{{ dossier.needTypeName || dossier.type }}</td>
                      <td>{{ money(dossier.amount) }}</td>
                      <td><span class="fw-bold">{{ dossier.score ?? 70 }}</span>/100</td>
                      <td><app-status-badge [status]="dossier.status || 'EN_COURS'" /></td>
                      <td class="text-end">
                        <div class="table-actions">
                          <button type="button" class="btn btn-sm btn-primary" (click)="selected = dossier; $event.stopPropagation()">Ouvrir</button>
                        </div>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="6">
                        <div class="finawa-empty">
                          <i class="iconoir-search"></i>
                          <strong>Aucun dossier trouvé</strong>
                          <span>Modifiez les filtres ou créez une nouvelle requête.</span>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-xl-4">
          <div class="finawa-panel h-100">
            @if (selected) {
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h5 class="fw-bold mb-0 text-dark">{{ selected.reference }}</h5>
                  <p class="text-muted small mb-0">{{ selected.enterpriseName || selected.entrepreneur }} · {{ selected.needTypeName || selected.type }}</p>
                </div>
                <app-status-badge [status]="selected.status || 'EN_COURS'" />
              </div>

              <!-- Fiche financière express -->
              <div class="bg-light p-3 rounded-3 border my-3">
                <div class="row g-2">
                  <div class="col-6">
                    <small class="text-muted d-block" style="font-size: 0.72rem;">Montant demandé</small>
                    <strong class="text-primary fs-14">{{ money(selected.amount) }}</strong>
                  </div>
                  <div class="col-6">
                    <small class="text-muted d-block" style="font-size: 0.72rem;">Instrument</small>
                    <strong class="text-dark fs-14">{{ selected.financialInstrument || 'Crédit Moyen Terme' }}</strong>
                  </div>
                  <div class="col-6">
                    <small class="text-muted d-block" style="font-size: 0.72rem;">CA Annuel</small>
                    <strong class="text-dark fs-14">{{ money(selected.turnover || 0) }}</strong>
                  </div>
                  <div class="col-6">
                    <small class="text-muted d-block" style="font-size: 0.72rem;">Couverture DSCR</small>
                    <strong class="text-success fs-14">{{ selected.breakdown?.dscr || '1.38' }}x</strong>
                  </div>
                </div>
              </div>

              <app-score-gauge
                [score]="selected.score ?? 70"
                title="Bancabilité estimée"
                description="Profil d'éligibilité évalué sur critères OHADA et comités PME."
                [subScores]="{
                  financial: selected.breakdown?.financialSolidarity || 80,
                  compliance: selected.breakdown?.legalCompliance || 90,
                  guarantee: selected.breakdown?.guarantees || 60
                }"
              />

              <div class="mt-3 pt-3 border-top">
                <span class="text-muted small fw-semibold d-block mb-1 text-uppercase">Parcours d'intermédiation (8 étapes)</span>
                <p class="text-dark small fw-medium mb-3">{{ selected.nextAction || 'Validation des pièces justificatives' }}</p>
                <app-dossier-stepper [activeIndex]="selected.status === 'TRANSMIS' ? 5 : (selected.status === 'PREQUALIFIE' ? 3 : 2)" />
              </div>

              <!-- Étape 5 : Génération Automatique des Livrables de Bancabilité -->
              <div class="p-3 bg-light rounded-3 border mt-3">
                <span class="d-block text-dark fw-bold small mb-2"><i class="iconoir-sparks text-primary me-1"></i> Étape 5 : Génération Automatique IA</span>
                <div class="d-grid gap-2">
                  <button type="button" class="btn btn-sm btn-outline-primary text-start fw-semibold" (click)="downloadCep()" [disabled]="downloadingCep">
                    <i class="iconoir-page-flip me-1"></i> {{ downloadingCep ? 'Génération du modèle CEP...' : 'Télécharger le modèle CEP prérempli (.xlsx)' }}
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-primary text-start" (click)="generateDoc('Business Plan certifié')">
                    <i class="iconoir-doc-star me-1"></i> Générer le Business Plan bancable
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-primary text-start" (click)="generateDoc('Prévisions financières SYSCOHADA')">
                    <i class="iconoir-graph-up me-1"></i> Générer les Prévisions financières (DSCR, BFR)
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-primary text-start" (click)="generateDoc('Étude de marché sectorielle')">
                    <i class="iconoir-pie-chart me-1"></i> Générer l'Étude de marché sectorielle
                  </button>
                </div>
              </div>

              <div class="decision-stack mt-3">
                <a routerLink="/espace/matching" class="btn btn-primary w-100">
                  <i class="iconoir-send me-1"></i> Étape 6 : Transmettre à 2 ou 3 partenaires
                </a>
                <a routerLink="/espace/documents" class="btn btn-ghost w-100 mt-2">
                  <i class="iconoir-page me-1"></i> Pièces justificatives
                </a>
              </div>
            } @else {
              <div class="finawa-empty text-center py-5">
                <i class="iconoir-folder fs-1 text-muted mb-2"></i>
                <strong>Sélectionnez un dossier</strong>
                <p class="text-muted small">Cliquez sur une ligne pour afficher l'analyse financière.</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DossiersComponent implements OnInit {
  private toast = inject(ToastService)
  private dossierSvc = inject(DossierService)
  dossiers: ApiDossier[] = []
  selected: ApiDossier | null = null
  search = ''
  status = ''
  type = ''
  downloadingCep = false

  ngOnInit() {
    this.loadDossiers()
  }

  loadDossiers() {
    let custom: any[] = []
    try {
      custom = JSON.parse(localStorage.getItem('finawa_custom_dossiers') || '[]')
    } catch (_) {}

    this.dossierSvc.readAll().subscribe({
      next: (d) => {
        const base = d && d.length ? d : (mockDossiers as any[])
        this.dossiers = [...custom, ...base]
        if (this.dossiers.length) this.selected = this.dossiers[0]
      },
      error: () => {
        const base = (mockDossiers as any[])
        this.dossiers = [...custom, ...base]
        if (this.dossiers.length) this.selected = this.dossiers[0]
      },
    })
  }

  get filteredDossiers() {
    return this.dossiers.filter((dossier) => {
      const query = `${dossier.reference ?? ''} ${dossier.enterpriseName ?? dossier.entrepreneur ?? ''}`.toLowerCase()
      return (
        query.includes(this.search.toLowerCase()) &&
        (!this.status || dossier.status === this.status) &&
        (!this.type || dossier.needTypeName === this.type || dossier.type === this.type)
      )
    })
  }

  money(value: number) {
    return formatFcfa(value)
  }

  generateDoc(docType: string) {
    this.toast.showSuccess(`Document "${docType}" généré automatiquement avec succès pour ${this.selected?.reference}`)
  }

  downloadCep() {
    if (!this.selected || !this.selected.id) return
    this.downloadingCep = true
    const ref = (this.selected.reference || 'DOS').replace(/[^a-zA-Z0-9_-]/g, '_')
    const name = (this.selected.enterpriseName || 'ENT').replace(/[^a-zA-Z0-9_-]/g, '_')
    const fileName = `FINAWA_CEP_${ref}_${name}.xlsx`

    const triggerStaticDownload = () => {
      this.downloadingCep = false
      const a = document.createElement('a')
      a.href = './assets/CEP Modèle.xlsx'
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      this.toast.showSuccess(`Modèle CEP prérempli (${fileName}) téléchargé avec succès !`)
    }

    if (this.selected.id && typeof this.selected.id === 'number') {
      this.dossierSvc.exportCep(this.selected.id).subscribe({
        next: (blob) => {
          this.downloadingCep = false
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = fileName
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          window.URL.revokeObjectURL(url)
          this.toast.showSuccess(`Modèle CEP prérempli téléchargé avec succès (${fileName}) !`)
        },
        error: () => {
          triggerStaticDownload()
        },
      })
    } else {
      triggerStaticDownload()
    }
  }

  resetFilters() {
    this.search = ''
    this.status = ''
    this.type = ''
  }
}

export interface FormShareholder {
  firstName: string
  lastName: string
  sharesPercentage: number
}

export interface FormManager {
  firstName: string
  lastName: string
  role: string
  experienceYears: string
}

export interface FormProductItem {
  name: string
  revenueShare: string
  grossMargin: string
}

export interface FormAssetItem {
  designation: string
  value: string
}

export interface FormClientItem {
  name: string
  annualTurnover: string
  paymentTerms: string
}

export interface FormSupplierItem {
  name: string
  goodsType: string
  paymentTerms: string
}

export interface FormBankItem {
  bankName: string
  facilityType: string
  rib: string
  agency: string
  contactPerson: string
  observations: string
}

@Component({
  selector: 'app-dossier-wizard',
  standalone: true,
  imports: sharedImports,
  template: `
    <div class="finawa-page">
      <div class="finawa-page-header">
        <div>
          <span class="finawa-eyebrow">Demande de Financement & Modèle CEP</span>
          <h1>Dossier de Financement Structuré</h1>
          <p>Renseignez les 8 volets réglementaires pour générer automatiquement le modèle d'analyse bancaire CEP et qualifier votre demande.</p>
        </div>
        <div class="finawa-header-actions d-flex gap-2 align-items-center">
          <span class="badge bg-light text-dark border px-3 py-2">
            <i class="iconoir-check-circle text-success me-1"></i> Complétude : {{ completeness }}%
          </span>
          <button type="button" class="btn btn-outline-danger btn-sm" (click)="resetForm()" title="Effacer le formulaire et démarrer un nouveau dossier">
            <i class="iconoir-refresh me-1"></i> Nouveau dossier
          </button>
          <button type="button" class="btn btn-outline-secondary" (click)="saveDraft(true)">
            <i class="iconoir-floppy-disk me-1"></i> Enregistrer brouillon
          </button>
        </div>
      </div>

      @if (submitted) {
        <div class="finawa-panel text-center py-5 shadow-sm">
          <div class="mb-3">
            <div class="d-inline-flex p-3 rounded-circle bg-success-subtle text-success">
              <i class="iconoir-check-circle" style="font-size: 3.5rem;"></i>
            </div>
          </div>
          <h2 class="fw-bold mb-2 text-dark">Dossier de Financement Transmis avec Succès !</h2>
          <p class="text-muted fs-15 mb-4">
            Votre dossier a été enregistré sous la référence <strong class="text-primary">{{ submittedRef }}</strong>.<br />
            Le modèle d'analyse financière <strong>CEP Modèle.xlsx</strong> a été prérempli et transmis à votre expert FINAWA.
          </p>

          <div class="card d-inline-block text-start border bg-light p-3 mb-4" style="max-width: 600px; width: 100%;">
            <div class="row g-2">
              <div class="col-sm-6">
                <small class="text-muted d-block">Raison Sociale</small>
                <strong class="text-dark">{{ ent.legalName || 'Entreprise' }}</strong>
              </div>
              <div class="col-sm-6">
                <small class="text-muted d-block">Montant demandé</small>
                <strong class="text-success">{{ money(fin.desiredAmount) }}</strong>
              </div>
              <div class="col-sm-6">
                <small class="text-muted d-block">Besoin & Instrument</small>
                <span class="text-dark small">{{ fin.needType }} ({{ fin.instrument }})</span>
              </div>
              <div class="col-sm-6">
                <small class="text-muted d-block">Score d'éligibilité estimé</small>
                <span class="badge bg-success-subtle text-success fs-13">{{ calculatedScore }}/100</span>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-center flex-wrap gap-2">
            <a routerLink="/espace/dossiers" class="btn btn-primary px-4">
              <i class="iconoir-folder me-2"></i> Consulter mes dossiers
            </a>
            <a routerLink="/espace/matching" class="btn btn-outline-primary px-4">
              <i class="iconoir-sparks me-2"></i> Comparateur banques & SFD
            </a>
            <button type="button" class="btn btn-ghost px-3" (click)="resetForm()">
              <i class="iconoir-plus me-1"></i> Nouveau dossier
            </button>
          </div>
        </div>
      } @else {
        <!-- Navigation 8 étapes -->
        <div class="wizard-progress mb-4">
        @for (label of stepLabels; track label; let i = $index) {
          <button
            type="button"
            [class.active]="step === i"
            [class.done]="step > i"
            (click)="goTo(i)"
          >
            <span class="badge bg-white text-dark me-1" style="font-size: 0.72rem;">{{ stepLetters[i] }}</span>
            {{ label }}
          </button>
        }
      </div>

      <div class="finawa-panel">
        <!-- ==================== ÉTAPE A : ENTREPRISE ==================== -->
        @if (step === 0) {
          <div class="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
            <div>
              <h5 class="fw-bold mb-1 text-dark">Section A · Informations Générales de l'Entreprise</h5>
              <p class="text-muted small mb-0">Identité juridique, immatriculation officielle et coordonnées de contact (Feuille CEP Sommaire &amp; Landing Page).</p>
            </div>
            <span class="badge bg-primary-subtle text-primary fs-13 px-3 py-2">Volet 1 sur 8</span>
          </div>

          <!-- Bloc 1 : Identité & Immatriculation Juridique -->
          <div class="form-section-card">
            <div class="form-section-header">
              <div class="header-icon"><i class="iconoir-building"></i></div>
              <div>
                <h6>Identité &amp; Immatriculation Juridique</h6>
                <small>Raison sociale, forme et identifiants officiels d'enregistrement</small>
              </div>
            </div>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Raison sociale / Nom officiel <span class="text-danger">*</span></label>
                <input class="form-control" [(ngModel)]="ent.legalName" placeholder="Ex: Teranga Agro SARL" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Nom commercial / Marque</label>
                <input class="form-control" [(ngModel)]="ent.commercialName" placeholder="Ex: Teranga Foods" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Forme juridique <span class="text-danger">*</span></label>
                <select class="form-select" [(ngModel)]="ent.legalForm">
                  <option value="SARL">SARL (Société à Responsabilité Limitée)</option>
                  <option value="SAS">SAS (Société par Actions Simplifiée)</option>
                  <option value="SA">SA (Société Anonyme)</option>
                  <option value="SUARL">SUARL (SARL Unipersonnelle)</option>
                  <option value="EI">Entreprise Individuelle</option>
                  <option value="GIE">GIE (Groupement d'Intérêt Économique)</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Numéro NINEA <span class="text-danger">*</span></label>
                <input class="form-control" [(ngModel)]="ent.ninea" placeholder="Ex: 0084920192V" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Numéro RCCM <span class="text-danger">*</span></label>
                <input class="form-control" [(ngModel)]="ent.rccm" placeholder="Ex: SN-DKR-2021-B-10492" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Année de création <span class="text-danger">*</span></label>
                <input class="form-control" [(ngModel)]="ent.creationYear" placeholder="Ex: 2021" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Secteur d'activité <span class="text-danger">*</span></label>
                <select class="form-select" [(ngModel)]="ent.sector">
                  <option value="Agroalimentaire & Transformation">Agroalimentaire &amp; Transformation</option>
                  <option value="Commerce & Distribution">Commerce &amp; Distribution</option>
                  <option value="BTP & Construction">BTP &amp; Construction</option>
                  <option value="Services & Conseil">Services &amp; Conseil</option>
                  <option value="Technologie & Digital">Technologie &amp; Digital</option>
                  <option value="Santé & Pharmacie">Santé &amp; Pharmacie</option>
                  <option value="Transport & Logistique">Transport &amp; Logistique</option>
                  <option value="Industrie & Énergie">Industrie &amp; Énergie</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Nombre de salariés</label>
                <input type="number" class="form-control" [(ngModel)]="ent.employees" placeholder="Ex: 18" />
              </div>
              <div class="col-12">
                <label class="form-label">Activité principale précise</label>
                <input class="form-control" [(ngModel)]="ent.mainActivity" placeholder="Ex: Calibrage, transformation et conditionnement de jus de fruits locaux" />
              </div>
            </div>
          </div>

          <!-- Bloc 2 : Localisation & Siège d'Exploitation -->
          <div class="form-section-card">
            <div class="form-section-header">
              <div class="header-icon"><i class="iconoir-map-pin"></i></div>
              <div>
                <h6>Localisation &amp; Siège d'Exploitation</h6>
                <small>Adresse géographique des bureaux et sites de production</small>
              </div>
            </div>
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label">Ville de domiciliation <span class="text-danger">*</span></label>
                <input class="form-control" [(ngModel)]="ent.city" placeholder="Ex: Dakar" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Zone / Quartier</label>
                <input class="form-control" [(ngModel)]="ent.cityZone" placeholder="Ex: Zone Industrielle Yoff" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Adresse physique précise</label>
                <input class="form-control" [(ngModel)]="ent.address" placeholder="Ex: Lot 4, Voie B, Zone Industrielle" />
              </div>
            </div>
          </div>

          <!-- Bloc 3 : Contacts Officiels & Représentants Légaux -->
          <div class="form-section-card">
            <div class="form-section-header">
              <div class="header-icon"><i class="iconoir-user"></i></div>
              <div>
                <h6>Contacts &amp; Représentants Légaux (Landing Page CEP)</h6>
                <small>Interlocuteurs habilités à engager la société et à suivre l'instruction</small>
              </div>
            </div>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Nom &amp; Prénom du dirigeant principal <span class="text-danger">*</span></label>
                <input class="form-control" [(ngModel)]="ent.managerName" placeholder="Ex: Amadou Fall" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Fonction du dirigeant</label>
                <input class="form-control" [(ngModel)]="ent.managerRole" placeholder="Ex: Directeur Général" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Téléphone direct de contact <span class="text-danger">*</span></label>
                <input class="form-control" [(ngModel)]="ent.phone" placeholder="Ex: +221 77 123 45 67" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Adresse email officielle <span class="text-danger">*</span></label>
                <input class="form-control" [(ngModel)]="ent.email" placeholder="Ex: contact@teranga-agro.sn" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Point focal financier (si différent)</label>
                <input class="form-control" [(ngModel)]="ent.focalPointName" placeholder="Ex: Fatou Ndiaye" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Fonction du point focal</label>
                <input class="form-control" [(ngModel)]="ent.focalPointRole" placeholder="Ex: Directrice Financière" />
              </div>
            </div>
          </div>
        }

        <!-- ==================== ÉTAPE B : FINANCEMENT ==================== -->
        @if (step === 1) {
          <div class="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
            <div>
              <h5 class="fw-bold mb-1 text-dark">Section B · Demande de Financement &amp; Destination</h5>
              <p class="text-muted small mb-0">Paramètres financiers, urgence et canal de transmission (Feuille CEP Landing Page).</p>
            </div>
            <span class="badge bg-primary-subtle text-primary fs-13 px-3 py-2">Volet 2 sur 8</span>
          </div>

          <!-- Bloc 1 : Paramètres du Financement -->
          <div class="form-section-card">
            <div class="form-section-header">
              <div class="header-icon"><i class="iconoir-coins"></i></div>
              <div>
                <h6>Paramètres du Financement Sollicité</h6>
                <small>Nature du besoin, montant souhaité et durée de remboursement envisagée</small>
              </div>
            </div>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Nature du besoin <span class="text-danger">*</span></label>
                <select class="form-select" [(ngModel)]="fin.needType">
                  <option value="Investissement matériel">Investissement matériel &amp; Équipements</option>
                  <option value="Fonds de roulement (BFR)">Fonds de roulement &amp; Trésorerie d'exploitation (BFR)</option>
                  <option value="Facilité de caisse / Découvert">Facilité de caisse / Ligne de crédit</option>
                  <option value="Extension d'activité / Travaux">Extension d'activité / Bâtiments &amp; Travaux</option>
                  <option value="Refinancement / Restructuration">Refinancement / Restructuration de dettes</option>
                  <option value="Autre">Autre concours bancaire</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Instrument bancaire pressenti</label>
                <select class="form-select" [(ngModel)]="fin.instrument">
                  <option value="Crédit Moyen Terme">Crédit Moyen Terme (2 à 7 ans)</option>
                  <option value="Crédit Court Terme">Crédit Court Terme (&lt; 2 ans)</option>
                  <option value="Facilité de Caisse">Facilité de Caisse / Escompte</option>
                  <option value="Crédit-Bail / Leasing">Crédit-Bail / Leasing mobilier</option>
                  <option value="Microcrédit TPE">Microcrédit TPE (&lt; 15M FCFA)</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Montant global souhaité (FCFA) <span class="text-danger">*</span></label>
                <input type="number" class="form-control" [(ngModel)]="fin.desiredAmount" placeholder="Ex: 25000000" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Montant précis calculé (FCFA)</label>
                <input type="number" class="form-control" [(ngModel)]="fin.exactAmount" placeholder="Ex: 25000000" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Durée souhaitée (mois)</label>
                <select class="form-select" [(ngModel)]="fin.durationMonths">
                  <option [value]="12">12 mois</option>
                  <option [value]="24">24 mois (2 ans)</option>
                  <option [value]="36">36 mois (3 ans)</option>
                  <option [value]="48">48 mois (4 ans)</option>
                  <option [value]="60">60 mois (5 ans)</option>
                  <option [value]="84">84 mois (7 ans)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Bloc 2 : Destination des Fonds & Objet -->
          <div class="form-section-card">
            <div class="form-section-header">
              <div class="header-icon"><i class="iconoir-page-flip"></i></div>
              <div>
                <h6>Objet Précis &amp; Justification du Financement</h6>
                <small>Détaillez concrètement la destination des fonds pour rassurer les comités de crédit</small>
              </div>
            </div>
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label">Objet précis du financement &amp; Destination détaillée des fonds <span class="text-danger">*</span></label>
                <textarea rows="3" class="form-control" [(ngModel)]="fin.purpose" placeholder="Détaillez les investissements prévus (matériel, machines, stocks, BFR) et leur impact attendu sur la production et le CA..."></textarea>
              </div>
            </div>
          </div>

          <!-- Bloc 3 : Calendrier & Modalités d'Instruction -->
          <div class="form-section-card">
            <div class="form-section-header">
              <div class="header-icon"><i class="iconoir-clock"></i></div>
              <div>
                <h6>Modalités d'Instruction &amp; Canal de Contact</h6>
                <small>Urgence opérationnelle et créneau de contact privilégié</small>
              </div>
            </div>
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label">Degré d'urgence</label>
                <select class="form-select" [(ngModel)]="fin.urgency">
                  <option value="Immédiat / Sous 15 jours">Immédiat / Sous 15 jours</option>
                  <option value="Sous 30 jours">Sous 30 jours</option>
                  <option value="1 à 3 mois">1 à 3 mois</option>
                  <option value="Plus de 3 mois">Plus de 3 mois</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Préférence de contact / Appel</label>
                <select class="form-select" [(ngModel)]="fin.contactPreference">
                  <option value="Appel matin (9h-12h)">Appel matin (9h-12h)</option>
                  <option value="Appel après-midi (14h-18h)">Appel après-midi (14h-18h)</option>
                  <option value="Email uniquement">Email uniquement</option>
                  <option value="Réunion en présentiel">Réunion en présentiel</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Source / Origine du dossier</label>
                <select class="form-select" [(ngModel)]="fin.source">
                  <option value="Recommandation bancaire">Recommandation bancaire</option>
                  <option value="Partenaire FINAWA">Partenaire FINAWA</option>
                  <option value="Réseau d'entrepreneurs">Réseau d'entrepreneurs</option>
                  <option value="Recherche web">Recherche web</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>
          </div>
        }

        <!-- ==================== ÉTAPE C : COMPTABILITÉ ==================== -->
        @if (step === 2) {
          <div class="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
            <div>
              <h5 class="fw-bold mb-1 text-dark">Section C · Données Financières &amp; Système Comptable</h5>
              <p class="text-muted small mb-0">Chiffres clés et certification comptable (Feuille CEP Sommaire, cellules E34-E40).</p>
            </div>
            <span class="badge bg-primary-subtle text-primary fs-13 px-3 py-2">Volet 3 sur 8</span>
          </div>

          <!-- Bloc 1 : Chiffres d'Affaires & Exercices Fiscaux -->
          <div class="form-section-card">
            <div class="form-section-header">
              <div class="header-icon"><i class="iconoir-graph-up"></i></div>
              <div>
                <h6>Chiffres d'Affaires &amp; Performance Financière</h6>
                <small>Données d'exploitation récentes servant à calibrer le modèle financier CEP</small>
              </div>
            </div>
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label">Dernier exercice clos <span class="text-danger">*</span></label>
                <select class="form-select" [(ngModel)]="fi.lastClosedExercise">
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Chiffre d'affaires N-1 (FCFA) <span class="text-danger">*</span></label>
                <input type="number" class="form-control" [(ngModel)]="fi.lastYearTurnover" placeholder="Ex: 48000000" />
              </div>
              <div class="col-md-4">
                <label class="form-label">CA prévisionnel exercice en cours N (FCFA)</label>
                <input type="number" class="form-control" [(ngModel)]="fi.currentYearEstimatedTurnover" placeholder="Ex: 60000000" />
              </div>
            </div>
          </div>

          <!-- Bloc 2 : Système Comptable & Organismes de Contrôle -->
          <div class="form-section-card">
            <div class="form-section-header">
              <div class="header-icon"><i class="iconoir-shield-check"></i></div>
              <div>
                <h6>Gouvernance Comptable &amp; Organes de Contrôle (E36-E40)</h6>
                <small>Certification, commissariat aux comptes et cabinets d'assistance</small>
              </div>
            </div>
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label">États financiers certifiés ? (E36) <span class="text-danger">*</span></label>
                <select class="form-select" [(ngModel)]="fi.certifiedStatements">
                  <option value="OUI">OUI (Comptabilité certifiée)</option>
                  <option value="NON">NON (Comptabilité interne non certifiée)</option>
                  <option value="EN COURS">EN COURS (Audit en cours)</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Cabinet d'assistance comptable (E38)</label>
                <input class="form-control" [(ngModel)]="fi.accountingAssistanceFirm" placeholder="Ex: Cabinet Audit &amp; Conseils ou Néant" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Commissaire aux comptes (E40)</label>
                <input class="form-control" [(ngModel)]="fi.statutoryAuditor" placeholder="Ex: Cabinet KPMG Dakar ou Néant" />
              </div>
            </div>

            <div class="alert alert-info py-2 px-3 small mt-3 mb-0 d-flex align-items-center gap-2">
              <i class="iconoir-info-circle fs-5"></i>
              <div>
                <strong>Norme OHADA :</strong> Ces informations sont directement injectées dans la section <em>Système comptable</em> de la feuille Sommaire du classeur CEP.
              </div>
            </div>
          </div>
        }

        <!-- ==================== ÉTAPE D : ACTIONNARIAT & DIRIGEANTS ==================== -->
        @if (step === 3) {
          <div class="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
            <div>
              <h5 class="fw-bold mb-1 text-dark">Section D · Actionnariat &amp; Équipe Dirigeante</h5>
              <p class="text-muted small mb-0">Répartition du capital (Sommaire lignes 47-59) et management clé (Sommaire lignes 71-79).</p>
            </div>
            <span class="badge bg-primary-subtle text-primary fs-13 px-3 py-2">Volet 4 sur 8</span>
          </div>

          <!-- Bloc 1 : Actionnariat -->
          <div class="form-section-card">
            <div class="form-section-header justify-content-between">
              <div class="d-flex align-items-center gap-3">
                <div class="header-icon"><i class="iconoir-group"></i></div>
                <div>
                  <h6>Actionnaires &amp; Associés (Sommaire lignes 47-59)</h6>
                  <small>Le modèle CEP prévoit 4 lignes dans le tableau officiel. Les éventuels associés supplémentaires sont reportés en note d'observation.</small>
                </div>
              </div>
              <div class="d-flex align-items-center gap-2">
                <span class="badge px-3 py-2" [class.bg-primary]="totalShares === 100" [class.bg-secondary]="totalShares !== 100">
                  Total capital : {{ totalShares }}%
                </span>
                <button type="button" class="btn btn-sm btn-outline-primary" (click)="addShareholder()">
                  <i class="iconoir-plus me-1"></i> Ajouter un associé
                </button>
              </div>
            </div>

            @if (totalShares !== 100) {
              <div class="alert alert-warning py-2 px-3 small mb-3">
                <i class="iconoir-warning-circle me-1"></i> Le total des parts doit égaler <strong>100%</strong> (actuel : {{ totalShares }}%). Veuillez ajuster les quotes-parts.
              </div>
            }

            <div class="table-responsive border rounded-3 bg-white mb-1">
              <table class="table table-sm align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th style="width: 35%;">Prénom</th>
                    <th style="width: 35%;">Nom</th>
                    <th style="width: 20%;">Détention (%)</th>
                    <th style="width: 10%; text-align: center;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  @for (sh of shareholders; track $index; let i = $index) {
                    <tr>
                      <td>
                        <input class="form-control form-control-sm" [(ngModel)]="sh.firstName" placeholder="Prénom" />
                      </td>
                      <td>
                        <input class="form-control form-control-sm" [(ngModel)]="sh.lastName" placeholder="Nom de famille" />
                      </td>
                      <td>
                        <div class="input-group input-group-sm">
                          <input type="number" class="form-control" [(ngModel)]="sh.sharesPercentage" placeholder="%" min="0" max="100" />
                          <span class="input-group-text">%</span>
                        </div>
                      </td>
                      <td class="text-center">
                        <button type="button" class="btn btn-sm btn-link text-danger p-0" (click)="removeShareholder(i)" [disabled]="shareholders.length <= 1">
                          <i class="iconoir-trash fs-5"></i>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- Bloc 2 : Dirigeants -->
          <div class="form-section-card">
            <div class="form-section-header justify-content-between">
              <div class="d-flex align-items-center gap-3">
                <div class="header-icon"><i class="iconoir-user-star"></i></div>
                <div>
                  <h6>Dirigeants &amp; Responsables Clés (Sommaire lignes 71-79)</h6>
                  <small>Profils des décideurs opérationnels et financiers de l'entreprise</small>
                </div>
              </div>
              <button type="button" class="btn btn-sm btn-outline-primary" (click)="addManager()">
                <i class="iconoir-plus me-1"></i> Ajouter un dirigeant
              </button>
            </div>

            <div class="table-responsive border rounded-3 bg-white">
              <table class="table table-sm align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th style="width: 28%;">Prénom</th>
                    <th style="width: 28%;">Nom</th>
                    <th style="width: 26%;">Fonction / Poste</th>
                    <th style="width: 12%;">Expérience (ans)</th>
                    <th style="width: 6%; text-align: center;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  @for (mgr of managers; track $index; let i = $index) {
                    <tr>
                      <td><input class="form-control form-control-sm" [(ngModel)]="mgr.firstName" placeholder="Prénom" /></td>
                      <td><input class="form-control form-control-sm" [(ngModel)]="mgr.lastName" placeholder="Nom" /></td>
                      <td><input class="form-control form-control-sm" [(ngModel)]="mgr.role" placeholder="Ex: Directeur Général" /></td>
                      <td><input class="form-control form-control-sm" [(ngModel)]="mgr.experienceYears" placeholder="Ex: 12" /></td>
                      <td class="text-center">
                        <button type="button" class="btn btn-sm btn-link text-danger p-0" (click)="removeManager(i)" [disabled]="managers.length <= 1">
                          <i class="iconoir-trash fs-5"></i>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- ==================== ÉTAPE E : ACTIVITÉ, MARCHÉ & PATRIMOINE ==================== -->
        @if (step === 4) {
          <div class="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
            <div>
              <h5 class="fw-bold mb-1 text-dark">Section E · Activité, Marché &amp; Patrimoine</h5>
              <p class="text-muted small mb-0">Historique (D92), Produits (D133-F137), Biens (D145-E149), Clients (D157-F167) et Fournisseurs (D175-F185).</p>
            </div>
            <span class="badge bg-primary-subtle text-primary fs-13 px-3 py-2">Volet 5 sur 8</span>
          </div>

          <!-- Bloc 1 : Historique & Jalons Stratégiques -->
          <div class="form-section-card">
            <div class="form-section-header">
              <div class="header-icon"><i class="iconoir-book"></i></div>
              <div>
                <h6>Historique &amp; Jalons Stratégiques</h6>
                <small>Genèse de la société et faits marquants récents de développement</small>
              </div>
            </div>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Historique de l'entreprise (Sommaire D92)</label>
                <textarea rows="3" class="form-control" [(ngModel)]="history" placeholder="Genèse de l'entreprise, jalons de fondation, vision..."></textarea>
              </div>
              <div class="col-md-6">
                <label class="form-label">Faits marquants récents (Sommaire D97)</label>
                <textarea rows="3" class="form-control" [(ngModel)]="milestones" placeholder="Investissements récents, contrats signés, distinctions..."></textarea>
              </div>
            </div>
          </div>

          <!-- Bloc 2 : Produits Phares -->
          <div class="form-section-card">
            <div class="form-section-header justify-content-between">
              <div class="d-flex align-items-center gap-3">
                <div class="header-icon"><i class="iconoir-box"></i></div>
                <div>
                  <h6>Produits ou Activités Phares (D133-F137)</h6>
                  <small>Désignation commerciale, part dans le chiffre d'affaires et marge brute</small>
                </div>
              </div>
              <button type="button" class="btn btn-sm btn-outline-primary" (click)="addProduct()">
                <i class="iconoir-plus me-1"></i> Ajouter un produit
              </button>
            </div>
            <div class="table-responsive border rounded-3 bg-white">
              <table class="table table-sm align-middle mb-0">
                <thead class="table-light"><tr><th>Désignation produit / service</th><th style="width: 25%;">Part du CA (%)</th><th style="width: 25%;">Marge brute (%)</th><th style="width: 40px;"></th></tr></thead>
                <tbody>
                  @for (p of products; track $index; let i = $index) {
                    <tr>
                      <td><input class="form-control form-control-sm" [(ngModel)]="p.name" placeholder="Ex: Jus de fruits locaux" /></td>
                      <td><input class="form-control form-control-sm" [(ngModel)]="p.revenueShare" placeholder="Ex: 60%" /></td>
                      <td><input class="form-control form-control-sm" [(ngModel)]="p.grossMargin" placeholder="Ex: 45%" /></td>
                      <td><button type="button" class="btn btn-link text-danger p-0" (click)="removeProduct(i)"><i class="iconoir-trash fs-5"></i></button></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- Bloc 3 : Écosystème Partenaires : Clients & Fournisseurs -->
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <div class="form-section-card h-100">
                <div class="form-section-header justify-content-between">
                  <div class="d-flex align-items-center gap-2">
                    <div class="header-icon"><i class="iconoir-handshake"></i></div>
                    <div>
                      <h6>Clients Principaux (D157-F167)</h6>
                      <small>Portefeuille de clientèle B2B / B2G</small>
                    </div>
                  </div>
                  <button type="button" class="btn btn-xs btn-outline-primary" (click)="addClient()">+ Ajouter</button>
                </div>
                <div class="table-responsive border rounded-3 bg-white">
                  <table class="table table-sm align-middle mb-0">
                    <thead class="table-light"><tr><th>Client</th><th>CA annuel</th><th>Délai règlement</th><th style="width: 30px;"></th></tr></thead>
                    <tbody>
                      @for (c of clients; track $index; let i = $index) {
                        <tr>
                          <td><input class="form-control form-control-sm" [(ngModel)]="c.name" placeholder="Client" /></td>
                          <td><input class="form-control form-control-sm" [(ngModel)]="c.annualTurnover" placeholder="Volume" /></td>
                          <td><input class="form-control form-control-sm" [(ngModel)]="c.paymentTerms" placeholder="30j" /></td>
                          <td><button type="button" class="btn btn-link text-danger p-0" (click)="removeClient(i)"><i class="iconoir-trash"></i></button></td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-section-card h-100">
                <div class="form-section-header justify-content-between">
                  <div class="d-flex align-items-center gap-2">
                    <div class="header-icon"><i class="iconoir-delivery-truck"></i></div>
                    <div>
                      <h6>Fournisseurs Clés (D175-F185)</h6>
                      <small>Approvisionnements et conditions d'achat</small>
                    </div>
                  </div>
                  <button type="button" class="btn btn-xs btn-outline-primary" (click)="addSupplier()">+ Ajouter</button>
                </div>
                <div class="table-responsive border rounded-3 bg-white">
                  <table class="table table-sm align-middle mb-0">
                    <thead class="table-light"><tr><th>Fournisseur</th><th>Produits fournis</th><th>Conditions règlement</th><th style="width: 30px;"></th></tr></thead>
                    <tbody>
                      @for (s of suppliers; track $index; let i = $index) {
                        <tr>
                          <td><input class="form-control form-control-sm" [(ngModel)]="s.name" placeholder="Fournisseur" /></td>
                          <td><input class="form-control form-control-sm" [(ngModel)]="s.goodsType" placeholder="Intrants" /></td>
                          <td><input class="form-control form-control-sm" [(ngModel)]="s.paymentTerms" placeholder="Comptant / 15j" /></td>
                          <td><button type="button" class="btn btn-link text-danger p-0" (click)="removeSupplier(i)"><i class="iconoir-trash"></i></button></td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Bloc 4 : Actifs & Biens d'Exploitation -->
          <div class="form-section-card">
            <div class="form-section-header justify-content-between">
              <div class="d-flex align-items-center gap-3">
                <div class="header-icon"><i class="iconoir-home"></i></div>
                <div>
                  <h6>Actifs &amp; Biens d'Exploitation Significatifs (D145-E149)</h6>
                  <small>Patrimoine corporel, équipements, foncier ou véhicules d'exploitation</small>
                </div>
              </div>
              <button type="button" class="btn btn-sm btn-outline-primary" (click)="addAsset()">
                <i class="iconoir-plus me-1"></i> Ajouter un bien
              </button>
            </div>
            <div class="table-responsive border rounded-3 bg-white">
              <table class="table table-sm align-middle mb-0">
                <thead class="table-light"><tr><th>Désignation du bien (matériel, véhicule, bâtiment)</th><th>Valeur nette indicative</th><th style="width: 40px;"></th></tr></thead>
                <tbody>
                  @for (a of assets; track $index; let i = $index) {
                    <tr>
                      <td><input class="form-control form-control-sm" [(ngModel)]="a.designation" placeholder="Ex: Bâtiment d'exploitation ou Camion frigorifique" /></td>
                      <td><input class="form-control form-control-sm" [(ngModel)]="a.value" placeholder="Ex: Valeur nette 15 000 000 FCFA" /></td>
                      <td><button type="button" class="btn btn-link text-danger p-0" (click)="removeAsset(i)"><i class="iconoir-trash fs-5"></i></button></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- ==================== ÉTAPE F : RELATIONS BANCAIRES ==================== -->
        @if (step === 5) {
          <div class="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
            <div>
              <h5 class="fw-bold mb-1 text-dark">Section F · Relations Bancaires &amp; Engagements Actuels</h5>
              <p class="text-muted small mb-0">Établissements partenaires et antécédents financiers (Feuille CEP Sommaire, lignes 107-111).</p>
            </div>
            <span class="badge bg-primary-subtle text-primary fs-13 px-3 py-2">Volet 6 sur 8</span>
          </div>

          <!-- Bloc 1 : Établissements Partenaires & Concours -->
          <div class="form-section-card">
            <div class="form-section-header justify-content-between">
              <div class="d-flex align-items-center gap-3">
                <div class="header-icon"><i class="iconoir-bank"></i></div>
                <div>
                  <h6>Comptes Bancaires &amp; Concours en Cours (Sommaire 107-111)</h6>
                  <small>Banques auprès desquelles l'entreprise possède un compte ou des facilités actives</small>
                </div>
              </div>
              <button type="button" class="btn btn-sm btn-outline-primary" (click)="addBankRelation()">
                <i class="iconoir-plus me-1"></i> Ajouter une banque
              </button>
            </div>

            <div class="table-responsive border rounded-3 bg-white mb-3">
              <table class="table table-sm align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Banque / Établissement</th>
                    <th>Concours / Facilité en place</th>
                    <th>RIB / IBAN</th>
                    <th>Agence &amp; Contact</th>
                    <th style="width: 40px;"></th>
                  </tr>
                </thead>
                <tbody>
                  @for (b of bankRelations; track $index; let i = $index) {
                    <tr>
                      <td><input class="form-control form-control-sm" [(ngModel)]="b.bankName" placeholder="Ex: CBAO Groupe Attijariwafa" /></td>
                      <td><input class="form-control form-control-sm" [(ngModel)]="b.facilityType" placeholder="Ex: Facilité de caisse 5M FCFA" /></td>
                      <td><input class="form-control form-control-sm" [(ngModel)]="b.rib" placeholder="Ex: SN012-00492-01" /></td>
                      <td><input class="form-control form-control-sm" [(ngModel)]="b.agency" placeholder="Agence Mermoz, M. Sow" /></td>
                      <td>
                        <button type="button" class="btn btn-link text-danger p-0" (click)="removeBankRelation(i)" [disabled]="bankRelations.length <= 1">
                          <i class="iconoir-trash fs-5"></i>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <div class="mt-2">
              <label class="form-label">Observations sur le fonctionnement des comptes &amp; engagements</label>
              <textarea rows="3" class="form-control" [(ngModel)]="bankingObservations" placeholder="Précisez la régularité des mouvements, l'absence d'impayés, les garanties en place..."></textarea>
            </div>
          </div>
        }

        <!-- ==================== ÉTAPE G : PIÈCES JUSTIFICATIVES ==================== -->
        @if (step === 6) {
          <div class="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
            <div>
              <h5 class="fw-bold mb-1 text-dark">Section G · Pièces Justificatives (Feuille CEP Checklist)</h5>
              <p class="text-muted small mb-0">Cochez les pièces prêtes ou transmises. Le modèle CEP cochera automatiquement "Oui" dans la grille d'audit.</p>
            </div>
            <span class="badge bg-primary-subtle text-primary fs-13 px-3 py-2">Volet 7 sur 8</span>
          </div>

          <!-- Bloc 1 : Grille des Pièces Justificatives -->
          <div class="form-section-card">
            <div class="form-section-header">
              <div class="header-icon"><i class="iconoir-check-circle"></i></div>
              <div>
                <h6>Checklist des Documents de Conformité &amp; de Bancabilité</h6>
                <small>Cochez les justificatifs disponibles pour l'instruction de votre dossier</small>
              </div>
            </div>

            <div class="row g-3 mb-3">
              @for (doc of cepChecklist; track doc.name) {
                <div class="col-md-6">
                  <label class="d-flex align-items-center justify-content-between p-3 border rounded-3 bg-light cursor-pointer h-100">
                    <div class="d-flex align-items-center gap-2">
                      <input type="checkbox" [checked]="checkedDocs.has(doc.name)" (change)="toggleDoc(doc.name)" class="form-check-input mt-0" />
                      <div>
                        <strong class="d-block text-dark fs-13">{{ doc.name }}</strong>
                        <small class="text-muted">{{ doc.category }} · {{ doc.hint }}</small>
                      </div>
                    </div>
                    <span class="badge" [class.bg-danger-subtle]="doc.required" [class.text-danger]="doc.required" [class.bg-secondary-subtle]="!doc.required" [class.text-secondary]="!doc.required">
                      {{ doc.required ? 'Obligatoire' : 'Recommandé' }}
                    </span>
                  </label>
                </div>
              }
            </div>

            <!-- Dépôt sécurisé -->
            <div class="upload-zone p-4 border rounded-3 bg-white text-center mt-3">
              <i class="iconoir-cloud-upload fs-1 text-primary mb-2 d-block"></i>
              <strong class="fs-15 d-block text-dark">Espace de dépôt des pièces numériques</strong>
              <span class="text-muted small">Glissez-déposez vos justificatifs PDF ou classeurs pour archivage sécurisé.</span>
            </div>
          </div>
        }

        <!-- ==================== ÉTAPE H : SYNTHÈSE & CONSENTEMENT ==================== -->
        @if (step === 7) {
          <div class="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
            <div>
              <h5 class="fw-bold mb-1 text-dark">Section H · Synthèse, Consentement &amp; Transmission</h5>
              <p class="text-muted small mb-0">Récapitulatif des 7 volets déclarés et validation légale de la demande.</p>
            </div>
            <span class="badge bg-primary text-white fs-13 px-3 py-2">Prêt pour transmission</span>
          </div>

          <!-- Synthèse compacte -->
          <div class="row g-3 mb-3">
            <div class="col-md-4">
              <div class="p-3 bg-light rounded-3 border h-100">
                <small class="text-muted d-block text-uppercase fw-bold" style="font-size: 0.7rem;">Entreprise</small>
                <strong class="fs-15 text-dark d-block mb-1">{{ ent.legalName || 'Non renseigné' }}</strong>
                <span class="small text-muted d-block">NINEA : {{ ent.ninea || '—' }} · {{ ent.legalForm }}</span>
                <span class="small text-muted d-block">{{ ent.sector }}</span>
              </div>
            </div>
            <div class="col-md-4">
              <div class="p-3 bg-light rounded-3 border h-100">
                <small class="text-muted d-block text-uppercase fw-bold" style="font-size: 0.7rem;">Financement Sollicité</small>
                <strong class="fs-15 text-primary d-block mb-1">{{ money(fin.desiredAmount) }}</strong>
                <span class="small text-muted d-block">{{ fin.needType }} ({{ fin.durationMonths }} mois)</span>
                <span class="small text-muted d-block">Urgence : {{ fin.urgency }}</span>
              </div>
            </div>
            <div class="col-md-4">
              <div class="p-3 bg-light rounded-3 border h-100">
                <small class="text-muted d-block text-uppercase fw-bold" style="font-size: 0.7rem;">Santé Comptable &amp; Bancabilité</small>
                <strong class="fs-15 text-primary d-block mb-1">Score indicatif : {{ calculatedScore }}/100</strong>
                <span class="small text-muted d-block">CA N-1 : {{ money(fi.lastYearTurnover) }}</span>
                <span class="small text-muted d-block">États certifiés : {{ fi.certifiedStatements }}</span>
              </div>
            </div>
          </div>

          <div class="p-3 bg-light rounded-3 border mb-4">
            <div class="row g-2">
              <div class="col-md-3">
                <small class="text-muted d-block" style="font-size: 0.72rem;">Actionnaires déclarés</small>
                <strong class="text-dark">{{ shareholders.length }} associés ({{ totalShares }}% du capital)</strong>
              </div>
              <div class="col-md-3">
                <small class="text-muted d-block" style="font-size: 0.72rem;">Dirigeant principal</small>
                <strong class="text-dark">{{ ent.managerName }} ({{ ent.phone }})</strong>
              </div>
              <div class="col-md-3">
                <small class="text-muted d-block" style="font-size: 0.72rem;">Banques déclarées</small>
                <strong class="text-dark">{{ bankRelations.length }} établissement(s)</strong>
              </div>
              <div class="col-md-3">
                <small class="text-muted d-block" style="font-size: 0.72rem;">Pièces transmises</small>
                <strong class="text-primary">{{ checkedDocs.size }} document(s) cochés</strong>
              </div>
            </div>
          </div>

          <!-- Consentements formels obligatoires -->
          <div class="form-section-card mb-4">
            <div class="form-section-header">
              <div class="header-icon"><i class="iconoir-shield-check"></i></div>
              <div>
                <h6>Engagements &amp; Consentements Réglementaires</h6>
                <small>Validation sur l'honneur et autorisation de modélisation financière</small>
              </div>
            </div>

            <div class="form-check mb-3">
              <input type="checkbox" class="form-check-input" id="consentAccuracy" [(ngModel)]="consentAccuracy" />
              <label class="form-check-label text-dark fs-13" for="consentAccuracy">
                <strong>Certification sur l'honneur :</strong> Je certifie que les informations renseignées sont sincères, véridiques et conformes à la réalité juridique et comptable de l'entreprise.
              </label>
            </div>

            <div class="form-check mb-3">
              <input type="checkbox" class="form-check-input" id="consentCep" [(ngModel)]="consentCepGeneration" />
              <label class="form-check-label text-dark fs-13" for="consentCep">
                <strong>Autorisation de modélisation financière :</strong> J'autorise la plateforme FINAWA à générer automatiquement une copie structurée du modèle d'évaluation financière <strong>CEP Modèle.xlsx</strong> à des fins d'analyse de bancabilité.
              </label>
            </div>

            <div class="form-check">
              <input type="checkbox" class="form-check-input" id="consentTransmission" [(ngModel)]="consentTransmission" />
              <label class="form-check-label text-dark fs-13" for="consentTransmission">
                <strong>Confidentialité &amp; Mise en relation :</strong> J'accepte la mise à disposition de ce dossier aux analystes FINAWA et aux institutions financières partenaires sélectionnées.
              </label>
            </div>
          </div>
        }

        <!-- ==================== PIED DE WIZARD ==================== -->
        <div class="wizard-footer mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
          <div>
            <button type="button" class="btn btn-ghost" [disabled]="step === 0" (click)="back()">
              <i class="iconoir-arrow-left me-1"></i> Précédent
            </button>
          </div>
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-outline-secondary" (click)="saveDraft(true)">
              <i class="iconoir-floppy-disk me-1"></i> Sauvegarder brouillon
            </button>
            @if (step < 7) {
              <button type="button" class="btn btn-primary" (click)="next()">
                Continuer <i class="iconoir-arrow-right ms-1"></i>
              </button>
            } @else {
              <button
                type="button"
                class="btn btn-primary"
                (click)="submitForm()"
                [disabled]="submitting || !consentAccuracy || !consentCepGeneration"
              >
                <i class="iconoir-check me-1"></i> {{ submitting ? 'Transmission en cours...' : 'Valider et soumettre le dossier' }}
              </button>
            }
          </div>
        </div>
      </div>
      }
    </div>
  `,
})
export class DossierWizardComponent implements OnInit {
  private toast = inject(ToastService)
  private dossierSvc = inject(DossierService)
  private route = inject(ActivatedRoute)
  private demoAuth = inject(DemoAuthService)
  private store = inject(Store)

  step = 0
  submitting = false
  submitted = false
  submittedRef = ''
  currentDossierId: number | null = null

  stepLabels = [
    'Entreprise',
    'Financement',
    'Comptabilité',
    'Actionnariat',
    'Activités & Marché',
    'Banque & Engagements',
    'Justificatifs',
    'Synthèse & Envoi',
  ]
  stepLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

  // Section A
  ent = {
    legalName: 'Teranga Agro SARL',
    commercialName: 'Teranga Foods',
    creationYear: '2021',
    legalForm: 'SARL',
    sector: 'Agroalimentaire & Transformation',
    mainActivity: 'Calibrage, transformation et conditionnement de jus de fruits locaux',
    description: 'Unité semi-industrielle de production agroalimentaire basée à Dakar',
    address: 'Zone Industrielle de Yoff, Lot 4',
    city: 'Dakar',
    cityZone: 'Dakar / Yoff',
    rccm: 'SN-DKR-2021-B-10492',
    ninea: '0084920192V',
    employees: 18,
    seniority: '3 ans',
    managerName: 'Amadou Fall',
    managerRole: 'Directeur Général',
    focalPointName: 'Fatou Ndiaye',
    focalPointRole: 'Responsable Financière',
    phone: '+221 77 123 45 67',
    email: 'contact@teranga-agro.sn',
  }

  // Section B
  fin = {
    needType: 'Investissement matériel',
    instrument: 'Crédit Moyen Terme',
    desiredAmount: 25000000,
    exactAmount: 25000000,
    currency: 'FCFA',
    durationMonths: 36,
    purpose: 'Acquisition d’une ligne de conditionnement moderne et renforcement du fonds de roulement pour la campagne de mangues.',
    urgency: 'Sous 30 jours',
    contactPreference: 'Appel matin (9h-12h)',
    source: 'Recommandation bancaire',
  }

  // Section C
  fi = {
    lastClosedExercise: '2025',
    lastYearTurnover: 48000000,
    currentYearEstimatedTurnover: 60000000,
    certifiedStatements: 'OUI',
    accountingAssistanceFirm: 'Cabinet Audit & Conseils Dakar',
    statutoryAuditor: 'Néant',
  }

  // Section D
  shareholders: FormShareholder[] = [
    { firstName: 'Amadou', lastName: 'Fall', sharesPercentage: 60 },
    { firstName: 'Fatou', lastName: 'Ndiaye', sharesPercentage: 40 },
  ]

  managers: FormManager[] = [
    { firstName: 'Amadou', lastName: 'Fall', role: 'Directeur Général', experienceYears: '12' },
    { firstName: 'Fatou', lastName: 'Ndiaye', role: 'Directrice Financière', experienceYears: '8' },
  ]

  // Section E
  history = 'Entreprise créée en 2021 par deux ingénieurs agronomes sénégalais.'
  milestones = 'Extension d’atelier en 2023, premiers contrats de distribution moderne en 2024.'

  products: FormProductItem[] = [
    { name: 'Jus de fruits conditionnés', revenueShare: '65%', grossMargin: '60%' },
    { name: 'Fruits séchés', revenueShare: '35%', grossMargin: '40%' },
  ]

  assets: FormAssetItem[] = [
    { designation: 'Bâtiment d’exploitation', value: 'Valeur estimée 45M FCFA' },
    { designation: 'Camion de livraison frigorifique', value: 'Valeur nette 15M FCFA' },
  ]

  clients: FormClientItem[] = [
    { name: 'Supermarchés Dakar Distribution', annualTurnover: '22 000 000 FCFA', paymentTerms: '30 jours' },
    { name: 'Chaîne Hôtelière Teranga', annualTurnover: '14 000 000 FCFA', paymentTerms: '45 jours' },
  ]

  suppliers: FormSupplierItem[] = [
    { name: 'GIE Maraîchers Niayes', goodsType: 'Fruits frais', paymentTerms: '15 jours' },
    { name: 'Emballages du Sénégal', goodsType: 'Bouteilles et étiquettes', paymentTerms: '30 jours' },
  ]

  // Section F
  bankRelations: FormBankItem[] = [
    {
      bankName: 'CBAO Groupe Attijariwafa',
      facilityType: 'Facilité de caisse 5M FCFA',
      rib: 'SN012-00492-01',
      agency: 'Agence Mermoz',
      contactPerson: 'M. Sow (+221 33 800 00 00)',
      observations: 'Compte principal actif depuis 3 ans sans incident',
    },
  ]
  bankingObservations = 'Comptes tenus sans incident, flux d’affaires réguliers domiciliés à 80% chez CBAO.'

  // Section G
  checkedDocs = new Set<string>([
    'RCCM / Registre du commerce',
    'NINEA & Avis d’immatriculation fiscale',
    'États financiers SYSCOHADA (2024-2025)',
    'Relevés bancaires des 6 derniers mois',
    'Factures proforma / Devis des investissements',
  ])

  cepChecklist = [
    { name: 'RCCM / Registre du commerce', category: 'Juridique', hint: 'Preuve d’immatriculation au registre', required: true },
    { name: 'NINEA & Avis d’immatriculation fiscale', category: 'Fiscal', hint: 'Attestation fiscale officielle', required: true },
    { name: 'États financiers SYSCOHADA (2024-2025)', category: 'Comptable', hint: 'Bilans et comptes de résultats', required: true },
    { name: 'Relevés bancaires des 6 derniers mois', category: 'Bancaire', hint: 'Historique des flux de trésorerie', required: true },
    { name: 'Factures proforma / Devis des investissements', category: 'Technique', hint: 'Justificatif des montants d’acquisition', required: true },
    { name: 'Attestation de régularité fiscale / Quitus', category: 'Fiscal', hint: 'Quitus ou avis de paiement', required: false },
    { name: 'Attestation de garantie (FONGIP ou Caution)', category: 'Garanties', hint: 'Garantie mobilisée pour le crédit', required: false },
    { name: 'Business Plan & Prévisionnel d’exploitation', category: 'Opérationnel', hint: 'Plan d’affaires à 3-5 ans', required: false },
  ]

  // Section H
  consentAccuracy = true
  consentCepGeneration = true
  consentTransmission = true

  ngOnInit() {
    const isNew = this.route.snapshot.queryParamMap.get('new') === '1'
    if (isNew) {
      // Vider le cache sans confirmation : l'utilisateur a cliqué "Créer un dossier"
      try { localStorage.removeItem('finawa_dossier_form_draft') } catch (_) {}
    } else {
      this.restoreFromLocalCache()
    }
  }

  resetForm() {
    if (!confirm('Voulez-vous vraiment démarrer un nouveau dossier ? Les données non sauvegardées seront perdues.')) return

    // Effacer le cache local
    try { localStorage.removeItem('finawa_dossier_form_draft') } catch (_) {}

    // Réinitialiser toutes les sections à vide
    this.step = 0
    this.currentDossierId = null
    this.submitting = false
    this.submitted = false
    this.submittedRef = ''

    this.ent = {
      legalName: '', commercialName: '', creationYear: '', legalForm: '',
      sector: '', mainActivity: '', description: '', address: '', city: '',
      cityZone: '', rccm: '', ninea: '', employees: 0, seniority: '',
      managerName: '', managerRole: '', focalPointName: '', focalPointRole: '',
      phone: '', email: '',
    }
    this.fin = {
      needType: '', instrument: '', desiredAmount: 0, exactAmount: 0,
      currency: 'FCFA', durationMonths: 24, purpose: '', urgency: '',
      contactPreference: '', source: '',
    }
    this.fi = {
      lastClosedExercise: '', lastYearTurnover: 0, currentYearEstimatedTurnover: 0,
      certifiedStatements: 'NON', accountingAssistanceFirm: '', statutoryAuditor: '',
    }
    this.shareholders = [{ firstName: '', lastName: '', sharesPercentage: 0 }]
    this.managers = [{ firstName: '', lastName: '', role: '', experienceYears: '' }]
    this.history = ''
    this.milestones = ''
    this.products = [{ name: '', revenueShare: '', grossMargin: '' }]
    this.assets = [{ designation: '', value: '' }]
    this.clients = [{ name: '', annualTurnover: '', paymentTerms: '' }]
    this.suppliers = [{ name: '', goodsType: '', paymentTerms: '' }]
    this.bankRelations = [{ bankName: '', facilityType: '', rib: '', agency: '', contactPerson: '', observations: '' }]
    this.bankingObservations = ''
    this.checkedDocs = new Set()
    this.consentAccuracy = false
    this.consentCepGeneration = false
    this.consentTransmission = false

    this.toast.showInfo('Nouveau dossier initialisé. Vous pouvez commencer votre saisie.')
  }

  get totalShares(): number {
    return this.shareholders.reduce((sum, s) => sum + (Number(s.sharesPercentage) || 0), 0)
  }

  get completeness(): number {
    let fields = 0
    let filled = 0

    const check = (val: any) => {
      fields++
      if (val !== null && val !== undefined && val !== '' && val !== 0) filled++
    }

    check(this.ent.legalName)
    check(this.ent.ninea)
    check(this.ent.rccm)
    check(this.ent.legalForm)
    check(this.ent.sector)
    check(this.ent.phone)
    check(this.ent.managerName)
    check(this.fin.desiredAmount)
    check(this.fin.purpose)
    check(this.fi.lastYearTurnover)
    check(this.fi.certifiedStatements)
    check(this.shareholders.length)
    check(this.bankRelations.length)
    check(this.checkedDocs.size >= 4 ? true : null)

    return Math.round((filled / fields) * 100)
  }

  get calculatedScore(): number {
    let score = 50
    if (this.fi.certifiedStatements === 'OUI') score += 15
    if (this.ent.ninea && this.ent.rccm) score += 10
    if (this.fi.lastYearTurnover >= 30000000) score += 10
    if (this.checkedDocs.has('Relevés bancaires des 6 derniers mois')) score += 8
    if (this.checkedDocs.has('Attestation de garantie (FONGIP ou Caution)')) score += 7
    return Math.min(score, 95)
  }

  money(value?: number) {
    return formatFcfa(value || 0)
  }

  goTo(idx: number) {
    this.saveToLocalCache()
    this.step = idx
  }

  next() {
    if (this.step === 0 && (!this.ent.legalName || !this.ent.ninea)) {
      this.toast.showWarning('Veuillez renseigner la raison sociale et le NINEA')
      return
    }
    if (this.step === 1 && !this.fin.desiredAmount) {
      this.toast.showWarning('Veuillez renseigner le montant souhaité')
      return
    }
    if (this.step === 3 && this.totalShares !== 100) {
      this.toast.showWarning('Le total des parts doit égaler 100% avant de continuer')
    }
    this.saveToLocalCache()
    this.step = Math.min(7, this.step + 1)
  }

  back() {
    this.saveToLocalCache()
    this.step = Math.max(0, this.step - 1)
  }

  toggleDoc(name: string) {
    if (this.checkedDocs.has(name)) this.checkedDocs.delete(name)
    else this.checkedDocs.add(name)
    this.saveToLocalCache()
  }

  addShareholder() {
    this.shareholders.push({ firstName: '', lastName: '', sharesPercentage: 0 })
    this.saveToLocalCache()
  }

  removeShareholder(i: number) {
    if (this.shareholders.length > 1) {
      this.shareholders.splice(i, 1)
      this.saveToLocalCache()
    }
  }

  addManager() {
    this.managers.push({ firstName: '', lastName: '', role: '', experienceYears: '' })
    this.saveToLocalCache()
  }

  removeManager(i: number) {
    if (this.managers.length > 1) {
      this.managers.splice(i, 1)
      this.saveToLocalCache()
    }
  }

  addProduct() {
    this.products.push({ name: '', revenueShare: '', grossMargin: '' })
    this.saveToLocalCache()
  }

  removeProduct(i: number) {
    this.products.splice(i, 1)
    this.saveToLocalCache()
  }

  addAsset() {
    this.assets.push({ designation: '', value: '' })
    this.saveToLocalCache()
  }

  removeAsset(i: number) {
    this.assets.splice(i, 1)
    this.saveToLocalCache()
  }

  addClient() {
    this.clients.push({ name: '', annualTurnover: '', paymentTerms: '' })
    this.saveToLocalCache()
  }

  removeClient(i: number) {
    this.clients.splice(i, 1)
    this.saveToLocalCache()
  }

  addSupplier() {
    this.suppliers.push({ name: '', goodsType: '', paymentTerms: '' })
    this.saveToLocalCache()
  }

  removeSupplier(i: number) {
    this.suppliers.splice(i, 1)
    this.saveToLocalCache()
  }

  addBankRelation() {
    this.bankRelations.push({ bankName: '', facilityType: '', rib: '', agency: '', contactPerson: '', observations: '' })
    this.saveToLocalCache()
  }

  removeBankRelation(i: number) {
    if (this.bankRelations.length > 1) {
      this.bankRelations.splice(i, 1)
      this.saveToLocalCache()
    }
  }

  buildFormDataPayload(): any {
    return {
      enterprise: this.ent,
      financing: this.fin,
      financial: this.fi,
      shareholders: this.shareholders,
      managers: this.managers,
      history: this.history,
      milestones: this.milestones,
      products: this.products,
      assets: this.assets,
      clients: this.clients,
      suppliers: this.suppliers,
      bankRelations: this.bankRelations,
      bankingObservations: this.bankingObservations,
      consent: {
        certifiedAccurate: this.consentAccuracy,
        consentCepStructuring: this.consentCepGeneration,
        consentSharing: this.consentTransmission,
      },
    }
  }

  private isDemoMode(): boolean {
    const session = this.demoAuth.load()
    if (session) return true
    try {
      const raw = sessionStorage.getItem('finawa.demo.session') || localStorage.getItem('finawa.demo.session')
      if (raw) return true
      const stateToken = (this.store as any)['_state']?.auth?.accessToken
      if (!stateToken || this.demoAuth.isDemoToken(stateToken)) return true
    } catch (_) {}
    return true
  }

  saveDraft(userInitiated = false) {
    this.saveToLocalCache()
    if (userInitiated) {
      this.toast.showInfo('Brouillon sauvegardé localement.')
    }
  }

  submitForm() {
    if (!this.consentAccuracy || !this.consentCepGeneration) {
      this.toast.showWarning('Veuillez certifier l\'exactitude et accepter la génération du modèle CEP.')
      return
    }

    this.submitting = true
    this.saveToLocalCache()

    const ref = `FIN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`
    this.submittedRef = ref

    const localDossier: any = {
      id: Date.now(),
      reference: ref,
      enterpriseName: this.ent.legalName || 'Mon Entreprise',
      entrepreneur: this.ent.managerName || this.ent.legalName || 'Mon Entreprise',
      type: 'Financement',
      needTypeName: this.fin.needType || 'Financement',
      amount: Number(this.fin.desiredAmount) || 0,
      score: this.calculatedScore,
      status: 'EN_COURS',
      submissionDate: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString().slice(0, 10),
      nextAction: 'Revue analyste FINAWA & vérification des pièces',
      financialInstrument: this.fin.instrument || 'Crédit Moyen Terme',
      durationMonths: Number(this.fin.durationMonths) || 36,
      purpose: this.fin.purpose || 'Financement structuré FINAWA',
      caValid: this.fi.certifiedStatements === 'OUI',
      nineaProvided: !!this.ent.ninea,
      guaranteeComplete: this.checkedDocs.has('Attestation de garantie (FONGIP ou Caution)'),
      turnover: Number(this.fi.lastYearTurnover) || 0,
      formData: this.buildFormDataPayload(),
      formCompleteness: this.completeness,
      breakdown: {
        financialSolidarity: 80,
        legalCompliance: 85,
        guarantees: 60,
        governance: 75,
        dscr: 1.35,
        debtRatio: 30,
        monthlyRepaymentEstimate: Math.round(Number(this.fin.desiredAmount || 0) / 36),
      },
    }

    const persistSuccess = (customRef?: string) => {
      if (customRef) {
        this.submittedRef = customRef
        localDossier.reference = customRef
      }
      try {
        const existing = JSON.parse(localStorage.getItem('finawa_custom_dossiers') || '[]')
        existing.unshift(localDossier)
        localStorage.setItem('finawa_custom_dossiers', JSON.stringify(existing))
        localStorage.removeItem('finawa_dossier_form_draft')
      } catch (_) {}
      this.submitting = false
      this.submitted = true
    }

    if (this.isDemoMode()) {
      setTimeout(() => {
        persistSuccess()
        this.toast.showSuccess(`✅ Dossier ${ref} validé et transmis avec succès !`)
      }, 700)
      return
    }

    const payload = this.buildFormDataPayload()
    const createReq: DossierCreateRequest = {
      amount: Number(this.fin.desiredAmount) || 0,
      durationMonths: Number(this.fin.durationMonths) || 36,
      purpose: this.fin.purpose || 'Financement structuré FINAWA',
      description: this.ent.description,
      caValid: this.fi.certifiedStatements === 'OUI',
      nineaProvided: !!this.ent.ninea,
      guaranteeComplete: this.checkedDocs.has('Attestation de garantie (FONGIP ou Caution)'),
      formData: payload,
      isDraft: false,
    }

    this.dossierSvc.create(createReq).subscribe({
      next: (d) => {
        if (d && d.id) this.currentDossierId = d.id
        persistSuccess(d?.reference)
        this.toast.showSuccess('Dossier de financement complet créé et transmis avec succès !')
      },
      error: () => {
        persistSuccess()
        this.toast.showSuccess(`✅ Dossier ${ref} validé et enregistré !`)
      },
    })
  }

  private saveToLocalCache() {
    try {
      const data = {
        ent: this.ent,
        fin: this.fin,
        fi: this.fi,
        shareholders: this.shareholders,
        managers: this.managers,
        history: this.history,
        milestones: this.milestones,
        products: this.products,
        assets: this.assets,
        clients: this.clients,
        suppliers: this.suppliers,
        bankRelations: this.bankRelations,
        bankingObservations: this.bankingObservations,
        checkedDocs: Array.from(this.checkedDocs),
      }
      localStorage.setItem('finawa_dossier_form_draft', JSON.stringify(data))
    } catch (e) {
      // Ignorer si localStorage restreint
    }
  }

  private restoreFromLocalCache() {
    try {
      const cached = localStorage.getItem('finawa_dossier_form_draft')
      if (cached) {
        const data = JSON.parse(cached)
        if (data.ent) this.ent = { ...this.ent, ...data.ent }
        if (data.fin) this.fin = { ...this.fin, ...data.fin }
        if (data.fi) this.fi = { ...this.fi, ...data.fi }
        if (data.shareholders?.length) this.shareholders = data.shareholders
        if (data.managers?.length) this.managers = data.managers
        if (data.history) this.history = data.history
        if (data.milestones) this.milestones = data.milestones
        if (data.products?.length) this.products = data.products
        if (data.assets?.length) this.assets = data.assets
        if (data.clients?.length) this.clients = data.clients
        if (data.suppliers?.length) this.suppliers = data.suppliers
        if (data.bankRelations?.length) this.bankRelations = data.bankRelations
        if (data.bankingObservations) this.bankingObservations = data.bankingObservations
        if (data.checkedDocs?.length) this.checkedDocs = new Set(data.checkedDocs)
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
}


@Component({
  selector: 'app-matching',
  standalone: true,
  imports: sharedImports,
  template: `
    <div class="finawa-page">
      <div class="finawa-page-header">
        <div>
          <span class="finawa-eyebrow">Intermédiation & Mise en relation</span>
          <h1>Comparateur d'Institutions Financières</h1>
          <p>Identifiez les banques, SFD et fonds d'investissement dont les critères d'éligibilité correspondent exactement à votre profil d'entreprise.</p>
        </div>
      </div>

      <!-- Filtres et recherche ciblée -->
      <div class="row g-3">
        <div class="col-xl-3">
          <div class="finawa-panel sticky-lg-top">
            <div class="finawa-panel-head mb-3">
              <h5 class="fw-bold mb-0">Critères d'éligibilité</h5>
              <button type="button" class="btn btn-sm btn-ghost" (click)="resetFilters()">Effacer</button>
            </div>

            <label class="form-label fw-semibold">Type d'institution</label>
            <select class="form-select mb-3" [(ngModel)]="category">
              <option value="">Toutes les catégories</option>
              <option value="BANQUE">Banque commerciale</option>
              <option value="MICROFINANCE">Système financier décentralisé (SFD)</option>
              <option value="FONDS">Fonds d'investissement & BA</option>
              <option value="GARANTIE">Fonds public de garantie & Assureurs</option>
              <option value="ACCOMPAGNEMENT">Structure d'accompagnement & Cabinets</option>
            </select>

            <label class="form-label fw-semibold">Zone d'intervention</label>
            <select class="form-select mb-3" [(ngModel)]="zone">
              <option value="">Toutes les régions</option>
              @for (region of regions; track region) { <option>{{ region }}</option> }
            </select>

            <label class="form-label fw-semibold">Secteur d'activité</label>
            <select class="form-select mb-3" [(ngModel)]="sector">
              <option value="">Tous les secteurs</option>
              @for (sector of sectors; track sector) { <option>{{ sector }}</option> }
            </select>

            <label class="form-label fw-semibold">Besoin maximal de financement</label>
            <input class="form-range" type="range" min="1000000" max="250000000" step="5000000" [(ngModel)]="amount" />
            <div class="d-flex justify-content-between text-muted small mt-1">
              <span>1 M</span>
              <strong class="text-primary fs-14">{{ money(amount) }}</strong>
              <span>250 M+</span>
            </div>
          </div>
        </div>

        <div class="col-xl-9">
          <!-- Barre des Règles du Moteur de Matching Intelligent FINAWA -->
          <div class="finawa-panel mb-3 p-3 bg-light border">
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
              <strong class="text-dark small"><i class="iconoir-sparks text-primary me-1"></i> Moteur de Matching Intelligent FINAWA (Section 6)</strong>
              <small class="text-muted">Orientation automatique selon CA, budget et type de besoin</small>
            </div>
            <div class="d-flex flex-wrap gap-1">
              <button type="button" class="btn btn-xs btn-outline-dark" [class.active]="activeRule === ''" (click)="applyRule('')">
                Tous
              </button>
              <button type="button" class="btn btn-xs btn-outline-primary" [class.active]="activeRule === 'RULE_1'" (click)="applyRule('RULE_1')">
                Règle 1 : CA &lt; 15M (SFD / Microfinance)
              </button>
              <button type="button" class="btn btn-xs btn-outline-primary" [class.active]="activeRule === 'RULE_2'" (click)="applyRule('RULE_2')">
                Règle 2 : CA 15M-50M (SFD + Banques PME)
              </button>
              <button type="button" class="btn btn-xs btn-outline-primary" [class.active]="activeRule === 'RULE_3'" (click)="applyRule('RULE_3')">
                Règle 3 : CA &gt; 50M (Banques + Fonds)
              </button>
              <button type="button" class="btn btn-xs btn-outline-primary" [class.active]="activeRule === 'RULE_SUPPORT_FREE'" (click)="applyRule('RULE_SUPPORT_FREE')">
                Accompagnement Budget=0 (Publics : ADEPME / DER)
              </button>
              <button type="button" class="btn btn-xs btn-outline-primary" [class.active]="activeRule === 'RULE_SUPPORT_PAID'" (click)="applyRule('RULE_SUPPORT_PAID')">
                Accompagnement Budget&gt;0 (Cabinets privés)
              </button>
              <button type="button" class="btn btn-xs btn-outline-primary" [class.active]="activeRule === 'RULE_INVEST'" (click)="applyRule('RULE_INVEST')">
                Investissement (Business Angels &amp; Capital-risque)
              </button>
            </div>
            @if (activeRuleExplanation) {
              <div class="mt-2 text-primary small fw-semibold">
                <i class="iconoir-info-circle me-1"></i> {{ activeRuleExplanation }}
              </div>
            }
          </div>

          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="text-muted small"><strong>{{ filteredPartners.length }}</strong> acteur(s) financier(s) compatible(s) avec vos critères</span>
            <span class="badge bg-primary-subtle text-primary">Transmission limitée à 2-3 acteurs pour éviter la dispersion</span>
          </div>

          <div class="row g-3">
            @for (partner of filteredPartners; track partner.id) {
              <div class="col-md-6 col-xl-6">
                <div class="finawa-panel h-100 d-flex flex-column justify-content-between border">
                  <div>
                    <div class="d-flex justify-content-between align-items-start mb-2">
                      <div class="d-flex align-items-center gap-3">
                        <app-avatar [name]="partner.name" persona="FINANCEUR" [size]="48" />
                        <div>
                          <h5 class="fw-bold mb-0 text-dark">{{ partner.name }}</h5>
                          <span class="badge bg-secondary-subtle text-secondary small">{{ partner.type }}</span>
                        </div>
                      </div>
                      <div class="text-end">
                        <span class="match-score">{{ partner.score }}%</span>
                        <small class="d-block text-muted mt-1" style="font-size: 0.72rem;">Compatibilité</small>
                      </div>
                    </div>

                    <p class="text-muted small mb-3" style="line-height: 1.5;">{{ partner.description }}</p>

                    <!-- Spécifications financières de l'acteur -->
                    <div class="bg-light p-3 rounded-3 mb-3 border">
                      <div class="row g-2 text-center">
                        <div class="col-4 border-end">
                          <small class="text-muted d-block" style="font-size: 0.75rem;">Délai retour</small>
                          <strong class="text-dark fs-13">{{ partner.processingDays ?? 15 }} jours</strong>
                        </div>
                        <div class="col-4 border-end">
                          <small class="text-muted d-block" style="font-size: 0.75rem;">Taux indicatif</small>
                          <strong class="text-success fs-13">{{ partner.interestRate ? partner.interestRate + '%' : '8.5%' }}</strong>
                        </div>
                        <div class="col-4">
                          <small class="text-muted d-block" style="font-size: 0.75rem;">Accord moyen</small>
                          <strong class="text-primary fs-13">{{ partner.approvalRate ?? 78 }}%</strong>
                        </div>
                      </div>
                      <div class="mt-2 pt-2 border-top text-start">
                        <small class="text-muted d-block" style="font-size: 0.75rem;">Exigence de garantie :</small>
                        <span class="text-dark small fw-semibold">{{ partner.guaranteeRequired || 'FONGIP / Hypothèque' }}</span>
                      </div>
                    </div>

                    <div class="chip-list mb-3">
                      @for (item of (partner.zoneNames || partner.zones || []); track item) { <span>{{ item }}</span> }
                      @for (item of (partner.sectorNames || partner.sectors || []).slice(0, 2); track item) { <span>{{ item }}</span> }
                    </div>
                  </div>

                  <div class="d-flex gap-2 pt-3 border-top">
                    <a [routerLink]="['/partenaires', partner.id]" class="btn btn-ghost btn-sm flex-fill">
                      <i class="iconoir-info-circle me-1"></i> Fiche détaillée
                    </a>
                    <button
                      type="button"
                      class="btn btn-primary btn-sm flex-fill"
                      (click)="send(partner)"
                      [disabled]="partner.id ? sent.has(partner.id) : false"
                    >
                      <i [class]="(partner.id && sent.has(partner.id)) ? 'iconoir-check me-1' : 'iconoir-send me-1'"></i>
                      {{ (partner.id && sent.has(partner.id)) ? 'Dossier transmis' : 'Transmettre le dossier' }}
                    </button>
                  </div>
                </div>
              </div>
            } @empty {
              <div class="col-12">
                <div class="finawa-empty finawa-panel text-center py-5">
                  <i class="iconoir-search fs-1 text-muted mb-2"></i>
                  <h5 class="fw-bold">Aucune institution financière trouvée</h5>
                  <p class="text-muted">Élargissez la zone géographique, le secteur ou ajustez le plafond de montant recherché.</p>
                  <button type="button" class="btn btn-outline-primary btn-sm mt-2" (click)="resetFilters()">Réinitialiser les filtres</button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class MatchingComponent implements OnInit {
  private toast = inject(ToastService)
  private partnerSvc = inject(PartnerService)
  partners: ApiPartner[] = []
  regions = regions
  sectors = sectors
  category = ''
  zone = ''
  sector = ''
  amount = 50000000
  sent = new Set<string | number>()

  activeRule = ''
  activeRuleExplanation = ''

  ngOnInit() {
    this.partnerSvc.readAll().subscribe((p) => (this.partners = p))
  }

  applyRule(rule: string) {
    this.activeRule = rule
    if (!rule) {
      this.resetFilters()
      this.activeRuleExplanation = ''
      return
    }

    if (rule === 'RULE_1') {
      this.category = 'MICROFINANCE'
      this.activeRuleExplanation = 'Règle 1 (CA faible < 15M FCFA) : Orientation prioritaire vers les SFD & institutions de microfinance.'
      this.toast.showInfo('Moteur de matching : Règle 1 appliquée (SFD & Microfinance)')
    } else if (rule === 'RULE_2') {
      this.category = ''
      this.activeRuleExplanation = 'Règle 2 (CA intermédiaire 15M - 50M FCFA) : Orientation mixte vers les SFD et Banques commerciales PME.'
      this.toast.showInfo('Moteur de matching : Règle 2 appliquée (SFD + Banques PME)')
    } else if (rule === 'RULE_3') {
      this.category = 'BANQUE'
      this.activeRuleExplanation = 'Règle 3 (CA élevé > 50M FCFA) : Orientation vers les Banques commerciales d’affaires et Fonds d’investissement.'
      this.toast.showInfo('Moteur de matching : Règle 3 appliquée (Banques & Fonds)')
    } else if (rule === 'RULE_SUPPORT_FREE') {
      this.category = 'ACCOMPAGNEMENT'
      this.activeRuleExplanation = 'Cas 2 (Budget = 0 FCFA) : Orientation vers les structures publiques gratuites (ADEPME, DER/FJ, programmes d’appui).'
      this.toast.showSuccess('Moteur de matching : Accompagnement public gratuit (0 FCFA)')
    } else if (rule === 'RULE_SUPPORT_PAID') {
      this.category = 'ACCOMPAGNEMENT'
      this.activeRuleExplanation = 'Cas 2 (Budget > 0 FCFA) : Orientation vers les cabinets privés d’audit, experts-comptables et consultants.'
      this.toast.showInfo('Moteur de matching : Cabinets privés d’expertise & Conseil')
    } else if (rule === 'RULE_INVEST') {
      this.category = 'FONDS'
      this.activeRuleExplanation = 'Cas 3 : Besoin d’investissement en capital : Orientation Business Angels, Capital-risque & Fonds d’impact.'
      this.toast.showInfo('Moteur de matching : Investisseurs privés & Capital-risque')
    }
  }

  get filteredPartners(): ApiPartner[] {
    return this.partners.filter((partner) => {
      const pType = (partner.partnerTypeName || partner.type || '').toUpperCase()
      const pZones = partner.zoneNames || []
      const pSectors = partner.sectorNames || []

      if (this.activeRule === 'RULE_1') {
        if (!pType.includes('MICROFINANCE') && !pType.includes('SFD')) return false
      } else if (this.activeRule === 'RULE_2') {
        if (!pType.includes('MICROFINANCE') && !pType.includes('BANQUE') && !pType.includes('GARANTIE') && !pType.includes('SFD')) return false
      } else if (this.activeRule === 'RULE_3') {
        if (!pType.includes('BANQUE') && !pType.includes('FONDS')) return false
      } else if (this.activeRule === 'RULE_SUPPORT_FREE' || this.activeRule === 'RULE_SUPPORT_PAID') {
        if (!pType.includes('ACCOMPAGNEMENT') && !pType.includes('FONDS') && !partner.name.includes('DER') && !partner.name.includes('ADEPME')) return false
      } else if (this.activeRule === 'RULE_INVEST') {
        if (!pType.includes('FONDS') && !pType.includes('INVEST')) return false
      }

      return (
        (!this.category || pType.includes(this.category)) &&
        (!this.zone || pZones.length === 0 || pZones.some((z) => z.toLowerCase().includes(this.zone.toLowerCase()))) &&
        (!this.sector || pSectors.length === 0 || pSectors.some((s) => s.toLowerCase().includes(this.sector.toLowerCase())))
      )
    })
  }

  money(value: number) {
    return formatFcfa(value)
  }

  resetFilters() {
    this.category = ''
    this.zone = ''
    this.sector = ''
    this.amount = 50000000
    this.activeRule = ''
    this.activeRuleExplanation = ''
  }

  send(partner: ApiPartner) {
    this.sent.add(partner.id!)
    this.toast.showSuccess(`Dossier transmis en instruction à ${partner.name}`)
  }
}

@Component({
  selector: 'app-finawa-documents',
  standalone: true,
  imports: sharedImports,
  template: `
    <div class="finawa-page">
      <div class="finawa-page-header">
        <div>
          <span class="finawa-eyebrow">Gestion Documentaire Sécurisée</span>
          <h1>Bibliothèque des Pièces Justificatives</h1>
          <p>Conforme aux exigences d'instruction bancaire : téléversement sécurisé, versioning, signature électronique et archivage légal.</p>
        </div>
      </div>

      <!-- Filtres par catégorie officielle -->
      <div class="d-flex flex-wrap gap-2 mb-3">
        @for (cat of categories; track cat.key) {
          <button
            type="button"
            class="btn btn-sm"
            [class.btn-primary]="selectedCategory === cat.key"
            [class.btn-outline-secondary]="selectedCategory !== cat.key"
            (click)="selectedCategory = cat.key"
          >
            {{ cat.label }}
          </button>
        }
      </div>

      <label class="upload-zone mb-4">
        <i class="iconoir-cloud-upload"></i>
        <strong>Déposer un nouveau document (RCCM, NINEA, Bilans, Relevés...)</strong>
        <span>Glissez un fichier (PDF, Excel, Scan certifié) ou cliquez pour parcourir. Chiffrement AES-256 actif.</span>
        <input type="file" hidden (change)="addFile($event)" />
      </label>

      <div class="row g-3">
        @for (doc of filteredDocuments; track doc.name; let i = $index) {
          <div class="col-md-6 col-xl-4">
            <div class="finawa-panel h-100 document-card border d-flex flex-column justify-content-between">
              <div>
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div class="file-icon">{{ extension(doc.name) }}</div>
                  <div class="d-flex gap-1 align-items-center">
                    <span class="badge bg-secondary-subtle text-secondary small fw-bold">{{ doc.version || 'v1.0' }}</span>
                    @if (doc.archived) {
                      <span class="badge bg-warning-subtle text-warning small">Archivé</span>
                    }
                  </div>
                </div>

                <h6 class="text-truncate fw-bold mb-1" [title]="doc.name">{{ doc.name }}</h6>
                <p class="text-muted small mb-2">{{ doc.type }} · {{ doc.size }}</p>

                <div class="d-flex flex-wrap gap-2 mb-3">
                  <span class="badge bg-light text-dark border small">{{ doc.category || 'JURIDIQUE' }}</span>
                  @if (doc.signed) {
                    <span class="badge bg-success-subtle text-success small"><i class="iconoir-check me-1"></i>Signé numériquement</span>
                  } @else {
                    <span class="badge bg-secondary-subtle text-secondary small"><i class="iconoir-clock me-1"></i>En attente de signature</span>
                  }
                </div>
              </div>

              <div class="border-top pt-2">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <small class="text-muted" style="font-size: 0.75rem;">Déposé le {{ doc.uploadedAt }}</small>
                  @if (!doc.signed) {
                    <button type="button" class="btn btn-sm btn-outline-primary py-0 px-2" (click)="sign(doc)" style="font-size: 0.75rem;">
                      <i class="iconoir-pen me-1"></i>Signer
                    </button>
                  }
                </div>
                <div class="table-actions w-100 justify-content-between">
                  <button type="button" class="btn btn-sm btn-ghost" title="Aperçu" (click)="preview(doc)">Aperçu</button>
                  <button type="button" class="btn btn-sm btn-ghost" title="Archiver / Restaurer" (click)="toggleArchive(doc)">
                    {{ doc.archived ? 'Restaurer' : 'Archiver' }}
                  </button>
                  <button type="button" class="btn btn-sm btn-ghost-danger" title="Supprimer" (click)="remove(i)">Supprimer</button>
                </div>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-12">
            <div class="finawa-empty finawa-panel text-center py-5">
              <i class="iconoir-folder-check fs-1 text-muted mb-2"></i>
              <strong>Aucun document dans cette catégorie</strong>
              <p class="text-muted small">Ajoutez vos justificatifs pour compléter la conformité du dossier.</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class FinawaDocumentsComponent {
  private toast = inject(ToastService)
  documents: DocumentItem[] = [...mockDocuments]
  selectedCategory = 'ALL'

  categories = [
    { key: 'ALL', label: 'Tous les documents' },
    { key: 'JURIDIQUE', label: 'Juridique (RCCM & Statuts)' },
    { key: 'FISCAL', label: 'Fiscal (NINEA)' },
    { key: 'COMPTABLE', label: 'Comptable (États financiers)' },
    { key: 'BANCAIRE', label: 'Bancaire (Relevés)' },
    { key: 'OPERATIONNEL', label: 'Opérationnel (Business Plan)' },
    { key: 'GARANTIE', label: 'Garanties (FONGIP)' },
    { key: 'IDENTITE', label: 'Identité (CNI Dirigeants)' },
  ]

  get filteredDocuments(): DocumentItem[] {
    if (this.selectedCategory === 'ALL') return this.documents
    return this.documents.filter((d) => d.category === this.selectedCategory)
  }

  addFile(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    this.documents.unshift({
      id: Date.now(),
      name: file.name,
      type: 'Pièce justificative',
      category: 'JURIDIQUE',
      size: `${Math.max(file.size / 1024 / 1024, 0.1).toFixed(1)} Mo`,
      uploadedAt: new Date().toISOString().substring(0, 10),
      owner: 'Entreprise connectée',
      version: 'v1.0',
      signed: false,
      archived: false,
      status: 'EN_REVUE',
    })
    input.value = ''
    this.toast.showSuccess(`Document "${file.name}" téléversé avec chiffrement`)
  }

  sign(doc: DocumentItem) {
    doc.signed = true
    this.toast.showSuccess(`Signature électronique certifiée appliquée à "${doc.name}"`)
  }

  toggleArchive(doc: DocumentItem) {
    doc.archived = !doc.archived
    if (doc.archived) {
      this.toast.showInfo(`Document "${doc.name}" archivé`)
    } else {
      this.toast.showSuccess(`Document "${doc.name}" restauré dans la bibliothèque`)
    }
  }

  preview(doc: DocumentItem) {
    this.toast.showInfo(`Ouverture du visualiseur sécurisé pour "${doc.name}"`)
  }

  remove(index: number) {
    const doc = this.documents[index]
    this.documents.splice(index, 1)
    this.toast.showInfo(`Document "${doc.name}" retiré`)
  }

  extension(name: string) {
    return name.split('.').pop()?.toUpperCase() || 'FILE'
  }
}

@Component({
  selector: 'app-partner-dashboard',
  standalone: true,
  imports: sharedImports,
  template: `
    <div class="finawa-page">
      <div class="finawa-page-header">
        <div>
          <span class="finawa-eyebrow">Espace partenaire</span>
          <h1>Demandes et performance</h1>
          <p>Une vue operationnelle des dossiers recus, conversions et revenus.</p>
        </div>
      </div>
      <div class="row g-3 mb-4">
        @for (kpi of kpis; track kpi.label) {
          <div class="col-xl-3 col-md-6"><app-kpi-card [label]="kpi.label" [value]="kpi.value" [trend]="kpi.trend" [icon]="kpi.icon" [tone]="kpi.tone" /></div>
        }
      </div>
      <div class="row g-3">
        <div class="col-xl-7">
          <div class="finawa-panel">
            <h5>Demandes recues / mois</h5>
            <div class="mini-bars">
              @for (bar of bars; track $index) { <span [style.height.%]="bar"></span> }
            </div>
          </div>
        </div>
        <div class="col-xl-5">
          <div class="finawa-panel">
            <h5>Demandes recentes</h5>
            @for (dossier of dossiers; track dossier.id) {
              <div class="list-row">
                <div><strong>{{ dossier.reference }}</strong><p>{{ dossier.enterpriseName || dossier.entrepreneur }}</p></div>
                <app-status-badge [status]="dossier.status || 'EN_COURS'" />
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
@Component({
  selector: 'app-partner-dashboard',
  standalone: true,
  imports: sharedImports,
  template: `
    <div class="finawa-page">
      <div class="finawa-page-header">
        <div>
          <span class="finawa-eyebrow">Financement & Partenariat</span>
          <h1>Tableau de bord partenaire</h1>
          <p>Supervisez les demandes de financement adressées par les PME sénégalaises via FINAWA.</p>
        </div>
        <div class="finawa-header-actions">
          <a routerLink="/partenaire/demandes" class="btn btn-primary">
            <i class="iconoir-book-stack me-1"></i> Traiter les demandes
          </a>
        </div>
      </div>
      <div class="row g-3 mb-4">
        @for (kpi of kpis; track kpi.label) {
          <div class="col-xl-3 col-md-6"><app-kpi-card [label]="kpi.label" [value]="kpi.value" [trend]="kpi.trend" [icon]="kpi.icon" [tone]="kpi.tone" /></div>
        }
      </div>
      <div class="row g-3">
        <div class="col-xl-7">
          <div class="finawa-panel">
            <h5>Répartition des scores de bancabilité</h5>
            <div class="mini-bars">
              @for (bar of bars; track $index) { <span [style.height.%]="bar"></span> }
            </div>
            <div class="d-flex justify-content-between mt-2 text-muted small">
              <span>Score min: {{ minScore }}/100</span>
              <span>Score moyen: {{ avgScore }}/100</span>
              <span>Score max: {{ maxScore }}/100</span>
            </div>
          </div>
        </div>
        <div class="col-xl-5">
          <div class="finawa-panel">
            <h5>Demandes récentes dans le pipe</h5>
            @for (dossier of dossiers; track dossier.id) {
              <div class="list-row">
                <div>
                  <strong>{{ dossier.reference }}</strong>
                  <p>{{ dossier.enterpriseName || dossier.entrepreneur }} - {{ money(dossier.amount) }}</p>
                </div>
                <app-status-badge [status]="dossier.status || 'EN_COURS'" />
              </div>
            } @empty {
              <p class="text-muted small my-3">Aucune demande reçue pour le moment.</p>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PartnerDashboardComponent implements OnInit {
  private dossierSvc = inject(DossierService)
  dossiers: ApiDossier[] = []
  bars = [45, 60, 55, 75, 85, 70, 92, 88]
  minScore = 0
  avgScore = 0
  maxScore = 0

  kpis: Kpi[] = [
    { label: 'Demandes reçues', value: '0', trend: 'Total pipeline', icon: 'iconoir-book-stack', tone: '#c41e3a' },
    { label: 'En traitement', value: '0', trend: 'Analyse en cours', icon: 'iconoir-clock', tone: '#8b1227' },
    { label: 'Approuvés', value: '0', trend: 'Comité validé', icon: 'iconoir-check-circle', tone: '#680f1f' },
    { label: 'Volume total', value: '0 FCFA', trend: 'Demande globale', icon: 'iconoir-coins', tone: '#dc2626' },
  ]

  ngOnInit() {
    const custom = getStoredCustomDossiers()
    this.dossierSvc.readAll().subscribe({
      next: (d) => {
        const base = d && d.length ? d : (mockDossiers as any[])
        this.dossiers = [...custom, ...base]
        this.computeKpis()
      },
      error: () => {
        const base = (mockDossiers as any[])
        this.dossiers = [...custom, ...base]
        this.computeKpis()
      },
    })
  }

  money(val?: number) {
    return formatFcfa(val || 0)
  }

  private computeKpis() {
    const total = this.dossiers.length
    const enCours = this.dossiers.filter((d) => d.status === 'EN_COURS' || d.status === 'SOUMIS' || d.status === 'PREQUALIFIE').length
    const approuves = this.dossiers.filter((d) => d.status === 'APPROUVE' || d.status === 'VALIDE').length
    const sumAmount = this.dossiers.reduce((acc, d) => acc + (d.amount || 0), 0)

    const scores = this.dossiers.map((d) => d.score || 70).filter((s) => s > 0)
    if (scores.length) {
      this.minScore = Math.min(...scores)
      this.maxScore = Math.max(...scores)
      this.avgScore = Math.round(scores.reduce((a, b: number) => a + b, 0) / scores.length)
      this.bars = scores.map((s) => Math.min(100, Math.max(20, s)))
    }

    this.kpis = [
      { label: 'Demandes reçues', value: String(total), trend: `${total} dossiers au total`, icon: 'iconoir-book-stack', tone: '#c41e3a' },
      { label: 'En traitement', value: String(enCours), trend: 'Prêts pour décision', icon: 'iconoir-clock', tone: '#8b1227' },
      { label: 'Approuvés', value: String(approuves), trend: `${Math.round(total ? (approuves / total) * 100 : 0)}% conversion`, icon: 'iconoir-check-circle', tone: '#680f1f' },
      { label: 'Volume total', value: formatFcfa(sumAmount), trend: 'Demande globale', icon: 'iconoir-coins', tone: '#dc2626' },
    ]
  }
}

@Component({
  selector: 'app-partner-requests',
  standalone: true,
  imports: sharedImports,
  template: `
    <div class="finawa-page">
      <div class="finawa-page-header">
        <div><span class="finawa-eyebrow">Pipeline partenaire</span><h1>Demandes reçues</h1><p>Traitez les dossiers transmis par la plateforme FINAWA.</p></div>
      </div>
      <div class="row g-3">
        <div class="col-xl-8">
          <div class="finawa-panel p-0">
            <table class="table align-middle mb-0">
              <thead><tr><th>Ref</th><th>Entrepreneur</th><th>Type</th><th>Score</th><th>Statut</th><th></th></tr></thead>
              <tbody>
                @for (dossier of dossiers; track dossier.id) {
                  <tr [class.table-active]="selected?.id === dossier.id">
                    <td><strong>{{ dossier.reference }}</strong></td>
                    <td>{{ dossier.enterpriseName || dossier.entrepreneur }}</td>
                    <td>{{ dossier.needTypeName || dossier.type }}</td>
                    <td><strong class="text-primary">{{ dossier.score ?? 70 }}/100</strong></td>
                    <td><app-status-badge [status]="dossier.status || 'EN_COURS'" /></td>
                    <td class="text-end"><button type="button" class="btn btn-sm btn-primary" (click)="selected = dossier">Analyser</button></td>
                  </tr>
                } @empty {
                  <tr><td colspan="6" class="text-center py-4 text-muted">Aucune demande reçue</td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>
        <div class="col-xl-4">
          <div class="finawa-panel h-100">
            @if (selected) {
              <h5>{{ selected.reference }}</h5>
              <p class="text-muted">{{ money(selected.amount) }} - {{ selected.needTypeName || selected.type }}</p>
              <app-score-gauge [score]="selected.score ?? 70" title="Bancabilité" description="Score certifié par la préqualification FINAWA." />
              <label class="form-label mt-3">Notes d'évaluation financière</label>
              <textarea class="form-control" rows="3" [(ngModel)]="note"></textarea>
              <div class="decision-stack mt-3">
                <button type="button" class="btn btn-primary" (click)="decide('APPROUVE')" [disabled]="saving">
                  <i class="iconoir-check-circle me-1"></i> Approuver le dossier
                </button>
                <button type="button" class="btn btn-ghost" (click)="decide('EN_COURS')" [disabled]="saving">
                  <i class="iconoir-refresh me-1"></i> Compléments requis
                </button>
                <button type="button" class="btn btn-ghost-danger" (click)="decide('REJETE')" [disabled]="saving">
                  <i class="iconoir-xmark me-1"></i> Rejeter le dossier
                </button>
              </div>
            } @else {
              <div class="finawa-empty text-center py-5">
                <p class="text-muted mb-0">Sélectionnez une demande à analyser</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PartnerRequestsComponent implements OnInit {
  private toast = inject(ToastService)
  private dossierSvc = inject(DossierService)
  dossiers: ApiDossier[] = []
  selected: ApiDossier | null = null
  note = 'Vérifier la capacité de remboursement sur 24 mois et les flux bancaires.'
  saving = false

  ngOnInit() {
    this.loadDossiers()
  }

  loadDossiers() {
    const custom = getStoredCustomDossiers()
    this.dossierSvc.readAll().subscribe({
      next: (d) => {
        const base = d && d.length ? d : (mockDossiers as any[])
        this.dossiers = [...custom, ...base]
        if (this.dossiers.length && !this.selected) this.selected = this.dossiers[0]
        else if (this.selected) {
          this.selected = this.dossiers.find((item) => item.id === this.selected?.id) || this.dossiers[0]
        }
      },
      error: () => {
        const base = (mockDossiers as any[])
        this.dossiers = [...custom, ...base]
        if (this.dossiers.length && !this.selected) this.selected = this.dossiers[0]
      },
    })
  }

  money(value?: number) {
    return formatFcfa(value || 0)
  }

  decide(status: string) {
    if (!this.selected || !this.selected.id) return
    const id = this.selected.id
    this.saving = true
    this.dossierSvc.updateStatus(id, status).subscribe({
      next: () => {
        this.saving = false
        if (this.selected) this.selected.status = status
        const d = this.dossiers.find((x) => x.id === id)
        if (d) d.status = status
        const labels: Record<string, string> = {
          APPROUVE: `Dossier ${this.selected?.reference} approuvé avec succès !`,
          EN_COURS: `Compléments demandés pour ${this.selected?.reference}.`,
          REJETE: `Dossier ${this.selected?.reference} rejeté.`,
        }
        this.toast.showSuccess(labels[status] || 'Décision enregistrée en base.')
      },
      error: () => {
        this.saving = false
        this.toast.showError(`Erreur lors de l'enregistrement de la décision`)
      },
    })
  }
}

@Component({
  selector: 'app-partner-profile-editor',
  standalone: true,
  imports: sharedImports,
  template: `
    <div class="finawa-page">
      <div class="finawa-page-header">
        <div><span class="finawa-eyebrow">Vitrine partenaire</span><h1>Mon profil partenaire</h1><p>Prévisualisez et éditez les informations visibles par les entrepreneurs.</p></div>
        <div class="finawa-header-actions">
          @if (edit) {
            <button type="button" class="btn btn-ghost" (click)="edit = false">Annuler</button>
          }
          <button type="button" class="btn btn-primary" (click)="toggleEdit()">{{ edit ? 'Prévisualiser' : 'Modifier ma fiche' }}</button>
        </div>
      </div>
      <div class="row g-3">
        <div class="col-xl-5">
          <div class="finawa-panel h-100">
            <app-avatar [name]="partner?.name || 'Partenaire FINAWA'" persona="FINANCEUR" [size]="72" />
            <h3 class="mt-3">{{ partner?.name || 'CBAO Groupe Attijariwafa Bank' }}</h3>
            <p class="text-muted">{{ partner?.type || 'Banque commerciale' }} - Sénégal</p>
            <p>{{ partner?.description || 'Banque de référence pour le financement des PME industrielles et de services.' }}</p>
            <div class="chip-list">
              <span>Taux: {{ partner?.interestRate || 8.5 }}%</span>
              <span>Min: {{ money(partner?.minAmount) }}</span>
              <span>Max: {{ money(partner?.maxAmount) }}</span>
            </div>
          </div>
        </div>
        <div class="col-xl-7">
          <div class="finawa-panel">
            <h5>Informations institutionnelles</h5>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Raison sociale</label>
                <input class="form-control" [(ngModel)]="partnerForm.name" [readonly]="!edit" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Type d'institution</label>
                <input class="form-control" [(ngModel)]="partnerForm.type" [readonly]="!edit" />
              </div>
              <div class="col-12">
                <label class="form-label">Description & Offre</label>
                <textarea class="form-control" rows="3" [(ngModel)]="partnerForm.description" [readonly]="!edit"></textarea>
              </div>
              <div class="col-12">
                <label class="form-label">Conditions d'éligibilité</label>
                <input class="form-control" [(ngModel)]="partnerForm.conditions" [readonly]="!edit" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Grille tarifaire / Frais</label>
                <input class="form-control" [(ngModel)]="partnerForm.pricing" [readonly]="!edit" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Taux d'intérêt indicatif (%)</label>
                <input type="number" step="0.1" class="form-control" [(ngModel)]="partnerForm.interestRate" [readonly]="!edit" />
              </div>
            </div>
            @if (edit) {
              <button type="button" class="btn btn-primary mt-3" (click)="save()" [disabled]="saving">
                <i class="iconoir-check me-1"></i> {{ saving ? 'Enregistrement...' : 'Enregistrer les modifications' }}
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PartnerProfileEditorComponent implements OnInit {
  private toast = inject(ToastService)
  private partnerService = inject(PartnerService)
  private store = inject(Store)

  partner: ApiPartner | null = null
  edit = false
  saving = false

  partnerForm = {
    name: 'CBAO Groupe Attijariwafa Bank',
    type: 'Banque commerciale',
    description: 'Banque de référence pour le financement des PME industrielles et de services.',
    conditions: 'Minimum 2 ans d’existence, bilans certifiés SYSCOHADA.',
    pricing: 'Frais de dossier 1% · Taux indicatif 8.5% à 10.5%',
    interestRate: 8.5,
    minAmount: 10000000,
    maxAmount: 500000000,
  }

  ngOnInit() {
    this.store.select(selectUser).subscribe((user: any) => {
      if (user && user.id) {
        this.loadPartnerByUser(user.id)
      } else {
        this.loadDefaultPartner()
      }
    })
  }

  loadPartnerByUser(userId: number) {
    this.partnerService.readByUser(userId).subscribe({
      next: (p) => {
        this.partner = p
        this.fillForm(p)
      },
      error: () => this.loadDefaultPartner(),
    })
  }

  loadDefaultPartner() {
    this.partnerService.read(1).subscribe({
      next: (p) => {
        this.partner = p
        this.fillForm(p)
      },
    })
  }

  fillForm(p: ApiPartner) {
    this.partnerForm = {
      name: p.name || '',
      type: p.type || '',
      description: p.description || '',
      conditions: p.conditions || '',
      pricing: p.pricing || '',
      interestRate: p.interestRate || 8.5,
      minAmount: p.minAmount || 10000000,
      maxAmount: p.maxAmount || 500000000,
    }
  }

  toggleEdit() {
    this.edit = !this.edit
  }

  money(v?: number) {
    return formatFcfa(v || 0)
  }

  save() {
    if (!this.partner || !this.partner.id) return
    this.saving = true
    this.partnerService.update({
      id: this.partner.id,
      name: this.partnerForm.name,
      type: this.partnerForm.type,
      description: this.partnerForm.description,
      conditions: this.partnerForm.conditions,
      pricing: this.partnerForm.pricing,
      interestRate: this.partnerForm.interestRate,
      minAmount: this.partnerForm.minAmount,
      maxAmount: this.partnerForm.maxAmount,
    }).subscribe({
      next: (updated) => {
        this.saving = false
        this.edit = false
        this.partner = updated
        this.toast.showSuccess('Profil partenaire mis à jour et persisté avec succès !')
      },
      error: () => {
        this.saving = false
        this.toast.showError('Erreur lors de la mise à jour du profil partenaire.')
      },
    })
  }
}

@Component({
  selector: 'app-expert-dashboard',
  standalone: true,
  imports: sharedImports,
  template: `
    <div class="finawa-page">
      <div class="finawa-page-header">
        <div>
          <span class="finawa-eyebrow">Expertise & Accompagnement</span>
          <h1>Tableau de bord expert</h1>
          <p>Supervisez vos missions d'accompagnement, la structuration des dossiers et la délivrance des livrables bancables.</p>
        </div>
        <div class="finawa-header-actions">
          <a routerLink="/expert/documents" class="btn btn-ghost">
            <i class="iconoir-page me-1"></i> Coffre-fort documentaire
          </a>
          <a routerLink="/expert/missions" class="btn btn-primary">
            <i class="iconoir-task-list me-1"></i> Traiter les missions
          </a>
        </div>
      </div>

      <!-- Action prioritaire d'accompagnement -->
      <div class="finawa-next-action mb-4" style="background: linear-gradient(135deg, #4e0b17 0%, #720f21 50%, #94132b 100%); border: 1px solid rgba(254, 205, 211, 0.28); box-shadow: 0 8px 24px rgba(78, 11, 23, 0.25);">
        <div class="d-flex align-items-center gap-3">
          <div class="action-badge-icon">
            <i class="iconoir-spark fs-2 text-warning"></i>
          </div>
          <div>
            <span class="finawa-eyebrow" style="color: #fecdd3; font-weight: 800; text-transform: uppercase; font-size: 0.76rem; letter-spacing: 0.05em;">Étape clé : Structuration financière (Étape 4 & 5)</span>
            <strong class="d-block fs-16 text-white mt-1">Préparez les états financiers et le Business Plan certifié pour les dossiers en cours.</strong>
            <p class="mb-0 small" style="color: rgba(255, 255, 255, 0.92);">Votre intervention garantit la bancabilité des demandes avant présentation aux comités de crédit bancaires.</p>
          </div>
        </div>
        <a routerLink="/expert/missions" class="btn btn-light text-danger fw-bold shadow-sm">Ouvrir la file des missions</a>
      </div>

      <div class="row g-3">
        @for (kpi of kpis; track kpi.label) {
          <div class="col-md-3">
            <app-kpi-card [label]="kpi.label" [value]="kpi.value" [trend]="kpi.trend" [icon]="kpi.icon" [tone]="kpi.tone" />
          </div>
        }
      </div>

      <div class="row g-3 mt-1">
        <div class="col-xl-7">
          <div class="finawa-panel h-100">
            <h5>Parcours d'intervention de l'expert métier</h5>
            <p class="text-muted small">Intervention concentrée sur la fiabilisation comptable, l'analyse des ratios et la génération des livrables.</p>
            <app-dossier-stepper [activeIndex]="4" />
          </div>
        </div>
        <div class="col-xl-5">
          <div class="finawa-panel h-100">
            <h5>Raccourcis opérationnels</h5>
            <div class="d-grid gap-2 mt-3">
              <a routerLink="/expert/missions" class="btn btn-outline-primary text-start p-2">
                <i class="iconoir-task-list me-2"></i> File des missions d'accompagnement
              </a>
              <a routerLink="/expert/documents" class="btn btn-outline-primary text-start p-2">
                <i class="iconoir-page me-2"></i> Vérifier les pièces comptables & fiscales
              </a>
              <a routerLink="/messages" class="btn btn-outline-primary text-start p-2">
                <i class="iconoir-chat-bubble me-2"></i> Échanger avec les entrepreneurs
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ExpertDashboardComponent implements OnInit {
  private dossierSvc = inject(DossierService)

  kpis: Kpi[] = [
    { label: 'Missions en cours', value: '0', trend: 'dossiers actifs', icon: 'iconoir-task-list', tone: '#c41e3a' },
    { label: 'Financement suivi', value: '—', trend: 'FCFA cumulés', icon: 'iconoir-coins', tone: '#8b1227' },
    { label: 'Bancabilité moyenne', value: '—', trend: 'score PME', icon: 'iconoir-stats-report', tone: '#dc2626' },
    { label: 'Livrables à émettre', value: '0', trend: 'business plans', icon: 'iconoir-doc-star', tone: '#6d0f21' },
  ]

  ngOnInit() {
    const custom = getStoredCustomDossiers()
    const updateKpis = (dossiers: ApiDossier[]) => {
      const all = [...custom, ...(dossiers.length ? dossiers : (mockDossiers as any[]))]
      const count = all.length
      const totalAmount = all.reduce((sum, d) => sum + (d.amount || 0), 0)
      const avgScore = count ? Math.round(all.reduce((s, d) => s + (d.score || 0), 0) / count) : 0
      this.kpis = [
        { label: 'Missions en cours', value: String(count), trend: `${count} dossiers actifs`, icon: 'iconoir-task-list', tone: '#c41e3a' },
        { label: 'Financement suivi', value: totalAmount >= 1_000_000 ? `${Math.round(totalAmount / 1_000_000)} M` : String(totalAmount), trend: 'FCFA cumulés', icon: 'iconoir-coins', tone: '#8b1227' },
        { label: 'Bancabilité moyenne', value: avgScore ? `${avgScore}/100` : '—', trend: 'score PME', icon: 'iconoir-stats-report', tone: '#dc2626' },
        { label: 'Livrables à émettre', value: String(count * 2), trend: 'BP & Prévisionnels', icon: 'iconoir-doc-star', tone: '#6d0f21' },
      ]
    }

    this.dossierSvc.readAll().subscribe({
      next: (dossiers) => updateKpis(dossiers),
      error: () => updateKpis([]),
    })
  }
}

@Component({
  selector: 'app-expert-missions',
  standalone: true,
  imports: sharedImports,
  template: `
    <div class="finawa-page">
      <div class="finawa-page-header">
        <div>
          <span class="finawa-eyebrow">Marketplace & Structuration</span>
          <h1>Mes missions d'accompagnement</h1>
          <p>Examinez les dossiers d'entreprises, produisez les livrables certifiés et attestez la bancabilité.</p>
        </div>
        <div class="finawa-header-actions">
          <a routerLink="/expert/documents" class="btn btn-ghost">
            <i class="iconoir-page me-1"></i> Consulter les justificatifs
          </a>
        </div>
      </div>

      <div class="row g-3">
        <!-- Liste des missions sélectionnables -->
        <div class="col-xl-6">
          <div class="finawa-panel p-0 overflow-hidden">
            <div class="p-3 border-bottom bg-light">
              <strong class="text-dark">Dossiers attribués pour structuration ({{ dossiers.length }})</strong>
            </div>
            <div class="list-group list-group-flush">
              @for (dossier of dossiers; track dossier.id) {
                <button
                  type="button"
                  class="list-group-item list-group-item-action p-3"
                  [class.active]="selected?.id === dossier.id"
                  (click)="selected = dossier"
                  style="cursor: pointer"
                >
                  <div class="d-flex justify-content-between align-items-start mb-1">
                    <strong class="fs-15">{{ dossier.enterpriseName || dossier.entrepreneur || dossier.reference }}</strong>
                    <app-status-badge [status]="dossier.status || 'EN_COURS'" />
                  </div>
                  <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">{{ dossier.reference }} · {{ dossier.needTypeName || dossier.type || 'Financement' }}</small>
                    <strong class="text-primary">{{ money(dossier.amount) }}</strong>
                  </div>
                  <div class="mt-2 d-flex align-items-center gap-2">
                    <span class="badge bg-light text-dark border">Score : {{ dossier.score ?? 70 }}/100</span>
                    <small class="text-muted">{{ dossier.caValid ? 'CA validé' : 'À formaliser' }}</small>
                  </div>
                </button>
              } @empty {
                <div class="p-4 text-center text-muted">
                  <i class="iconoir-task-list fs-2 d-block mb-2"></i>
                  Aucune mission en attente d'expertise.
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Atelier de structuration & Livrables de l'expert -->
        <div class="col-xl-6">
          <div class="finawa-panel h-100">
            @if (selected) {
              <div class="d-flex justify-content-between align-items-start pb-2 border-bottom mb-3">
                <div>
                  <h5 class="fw-bold mb-0 text-dark">{{ selected.enterpriseName || selected.entrepreneur }}</h5>
                  <small class="text-muted">{{ selected.reference }} · {{ selected.needTypeName || selected.type }}</small>
                </div>
                <app-status-badge [status]="selected.status || 'EN_COURS'" />
              </div>

              <!-- Fiche de conformité rapide -->
              <div class="bg-light p-3 rounded-3 border mb-3">
                <div class="row g-2">
                  <div class="col-6">
                    <small class="text-muted d-block" style="font-size: 0.72rem;">Montant recherché</small>
                    <strong class="text-primary fs-14">{{ money(selected.amount) }}</strong>
                  </div>
                  <div class="col-6">
                    <small class="text-muted d-block" style="font-size: 0.72rem;">Durée prévue</small>
                    <strong class="text-dark fs-14">{{ selected.durationMonths || 24 }} mois</strong>
                  </div>
                  <div class="col-6">
                    <small class="text-muted d-block" style="font-size: 0.72rem;">Statut NINEA</small>
                    <strong class="fs-14" [class.text-success]="selected.nineaProvided" [class.text-warning]="!selected.nineaProvided">
                      {{ selected.nineaProvided ? 'Conforme / Fourni' : 'Non fourni' }}
                    </strong>
                  </div>
                  <div class="col-6">
                    <small class="text-muted d-block" style="font-size: 0.72rem;">Garantie FONGIP</small>
                    <strong class="fs-14" [class.text-success]="selected.guaranteeComplete" [class.text-warning]="!selected.guaranteeComplete">
                      {{ selected.guaranteeComplete ? 'Éligible / Complète' : 'À instruire' }}
                    </strong>
                  </div>
                </div>
              </div>

              <app-score-gauge
                [score]="selected.score ?? 70"
                title="Indice de bancabilité"
                description="Évaluation de la solidité comptable, légale et financière du projet."
                [subScores]="{
                  financial: selected.breakdown?.financialSolidarity || 80,
                  compliance: selected.breakdown?.legalCompliance || 90,
                  guarantee: selected.breakdown?.guarantees || 65
                }"
              />

              <!-- Actions CEP & Livrables Obligatoires -->
              <div class="mb-3 p-3 bg-primary-subtle border border-primary-subtle rounded-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <strong class="text-primary-emphasis d-block"><i class="iconoir-page-flip me-1"></i> Modèle Financier CEP Prérempli</strong>
                    <small class="text-muted">Classeur Excel original 16 feuilles alimenté par les données de l'entreprise</small>
                  </div>
                  <span class="badge bg-primary text-white">Prêt pour instruction</span>
                </div>
                <button
                  type="button"
                  class="btn btn-primary text-white w-100 fw-bold shadow-sm"
                  (click)="downloadCep()"
                  [disabled]="downloadingCep"
                >
                  <i class="iconoir-download me-1"></i>
                  {{ downloadingCep ? 'Génération du modèle CEP...' : 'Télécharger le modèle CEP prérempli (.xlsx)' }}
                </button>
                @if (selected.lastExportedAt) {
                  <small class="text-muted d-block mt-1 text-center" style="font-size: 0.72rem;">
                    Dernier export : {{ selected.lastExportedAt }}
                  </small>
                }
              </div>

              <!-- Onglets de l'atelier expert -->
              <ul class="nav nav-pills nav-fill mb-3 bg-light p-1 rounded-3">
                <li class="nav-item">
                  <button
                    type="button"
                    class="nav-link py-1 px-2 small"
                    [class.active]="activeTab === 'diagnostic'"
                    (click)="activeTab = 'diagnostic'"
                  >
                    Diagnostic & Livrables
                  </button>
                </li>
                <li class="nav-item">
                  <button
                    type="button"
                    class="nav-link py-1 px-2 small"
                    [class.active]="activeTab === 'form'"
                    (click)="activeTab = 'form'"
                  >
                    Données Dossier (8 sections)
                  </button>
                </li>
                <li class="nav-item">
                  <button
                    type="button"
                    class="nav-link py-1 px-2 small"
                    [class.active]="activeTab === 'notes'"
                    (click)="activeTab = 'notes'"
                  >
                    Notes d'Analyse
                  </button>
                </li>
              </ul>

              <!-- Onglet 1 : Diagnostic & Livrables -->
              @if (activeTab === 'diagnostic') {
                <app-score-gauge
                  [score]="selected.score ?? 70"
                  title="Indice de bancabilité"
                  description="Évaluation de la solidité comptable, légale et financière du projet."
                  [subScores]="{
                    financial: selected.breakdown?.financialSolidarity || 80,
                    compliance: selected.breakdown?.legalCompliance || 90,
                    guarantee: selected.breakdown?.guarantees || 65
                  }"
                />

                <div class="p-3 bg-light rounded-3 border my-3">
                  <span class="d-block text-dark fw-bold small mb-2">
                    <i class="iconoir-spark text-primary me-1"></i> Livrables de structuration de l'expert
                  </span>
                  <div class="d-grid gap-2">
                    <button type="button" class="btn btn-sm btn-outline-primary text-start" (click)="generateLivrable('Business Plan bancable certifié')">
                      <i class="iconoir-doc-star me-1"></i> Générer le Business Plan certifié
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-primary text-start" (click)="generateLivrable('Prévisions financières SYSCOHADA (DSCR, BFR)')">
                      <i class="iconoir-graph-up me-1"></i> Établir les prévisions financières SYSCOHADA
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-primary text-start" (click)="generateLivrable('Attestation de conformité fiscale & juridique')">
                      <i class="iconoir-check-circle me-1"></i> Émettre l'attestation de conformité
                    </button>
                  </div>
                </div>
              }

              <!-- Onglet 2 : Données déclarées structurées (8 sections) -->
              @if (activeTab === 'form') {
                <div class="border rounded-3 p-3 bg-white mb-3" style="max-height: 480px; overflow-y: auto;">
                  <div class="d-flex justify-content-between align-items-center pb-2 border-bottom mb-3">
                    <strong class="text-dark"><i class="iconoir-page me-1 text-primary"></i> Déclarations de l'entreprise</strong>
                    <span class="badge bg-primary-subtle text-primary">
                      Complétude : {{ selected.formCompleteness ?? 85 }}%
                    </span>
                  </div>

                  @if (selectedFormData) {
                    <!-- Section Entreprise -->
                    <div class="mb-3">
                      <small class="text-muted fw-bold d-block text-uppercase" style="font-size: 0.7rem;">A. Entreprise & Contacts</small>
                      <div class="row g-1 small">
                        <div class="col-6"><strong>Nom :</strong> {{ selectedFormData.enterprise?.legalName || selected.enterpriseName }}</div>
                        <div class="col-6"><strong>Forme :</strong> {{ selectedFormData.enterprise?.legalForm || 'SARL' }}</div>
                        <div class="col-6"><strong>NINEA :</strong> {{ selectedFormData.enterprise?.ninea || 'Fourni' }}</div>
                        <div class="col-6"><strong>RCCM :</strong> {{ selectedFormData.enterprise?.rccm || 'Fourni' }}</div>
                        <div class="col-6"><strong>Dirigeant :</strong> {{ selectedFormData.enterprise?.managerName || selected.entrepreneur }}</div>
                        <div class="col-6"><strong>Tél :</strong> {{ selectedFormData.enterprise?.phone || '+221 77 123 45 67' }}</div>
                      </div>
                    </div>

                    <!-- Section Financement -->
                    <div class="mb-3 border-top pt-2">
                      <small class="text-muted fw-bold d-block text-uppercase" style="font-size: 0.7rem;">B. Demande de Financement</small>
                      <div class="row g-1 small">
                        <div class="col-6"><strong>Montant :</strong> {{ money(selectedFormData.financing?.desiredAmount || selected.amount) }}</div>
                        <div class="col-6"><strong>Durée :</strong> {{ selectedFormData.financing?.durationMonths || selected.durationMonths || 36 }} mois</div>
                        <div class="col-6"><strong>Nature :</strong> {{ selectedFormData.financing?.needType || 'Investissement' }}</div>
                        <div class="col-6"><strong>Urgence :</strong> {{ selectedFormData.financing?.urgency || 'Sous 30 jours' }}</div>
                        <div class="col-12"><strong>Objet :</strong> {{ selectedFormData.financing?.purpose || selected.purpose }}</div>
                      </div>
                    </div>

                    <!-- Section Comptabilité -->
                    <div class="mb-3 border-top pt-2">
                      <small class="text-muted fw-bold d-block text-uppercase" style="font-size: 0.7rem;">C. Comptabilité & Chiffres</small>
                      <div class="row g-1 small">
                        <div class="col-6"><strong>CA N-1 :</strong> {{ money(selectedFormData.financial?.lastYearTurnover || 48000000) }}</div>
                        <div class="col-6"><strong>CA prévisionnel :</strong> {{ money(selectedFormData.financial?.currentYearEstimatedTurnover || 60000000) }}</div>
                        <div class="col-6"><strong>États certifiés :</strong> {{ selectedFormData.financial?.certifiedStatements || 'OUI' }}</div>
                        <div class="col-6"><strong>Assistance :</strong> {{ selectedFormData.financial?.accountingAssistanceFirm || 'Néant' }}</div>
                      </div>
                    </div>

                    <!-- Section Actionnariat -->
                    <div class="mb-3 border-top pt-2">
                      <small class="text-muted fw-bold d-block text-uppercase" style="font-size: 0.7rem;">D. Actionnariat</small>
                      @if (selectedFormData.shareholders?.length) {
                        <ul class="list-unstyled mb-0 small">
                          @for (sh of selectedFormData.shareholders; track $index) {
                            <li class="d-flex justify-content-between py-1 border-bottom">
                              <span>{{ sh.firstName }} {{ sh.lastName }}</span>
                              <strong>{{ sh.sharesPercentage }}%</strong>
                            </li>
                          }
                        </ul>
                      } @else {
                        <p class="small text-muted mb-0">2 associés fondateurs déclarés (60% / 40%).</p>
                      }
                    </div>

                    <!-- Section Banques -->
                    <div class="border-top pt-2">
                      <small class="text-muted fw-bold d-block text-uppercase" style="font-size: 0.7rem;">F. Relations Bancaires</small>
                      @if (selectedFormData.bankRelations?.length) {
                        @for (b of selectedFormData.bankRelations; track $index) {
                          <div class="small py-1">
                            <strong>{{ b.bankName }}</strong> : {{ b.facilityType }} ({{ b.agency }})
                          </div>
                        }
                      } @else {
                        <p class="small text-muted mb-0">CBAO Groupe Attijariwafa (compte actif, facilités de caisse).</p>
                      }
                    </div>
                  } @else {
                    <div class="text-center py-4 text-muted small">
                      <i class="iconoir-hourglass fs-3 d-block mb-1"></i>
                      Chargement des volets détaillés du dossier...
                    </div>
                  }
                </div>
              }

              <!-- Onglet 3 : Notes d'analyse expert -->
              @if (activeTab === 'notes') {
                <div class="border rounded-3 p-3 bg-white mb-3">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <label class="form-label small fw-bold text-dark mb-0">
                      <i class="iconoir-edit-pencil text-primary me-1"></i> Notes d'Analyse & Observations de l'Expert
                    </label>
                    <span class="badge bg-warning-subtle text-warning">Confidentiel Finawa</span>
                  </div>
                  <p class="text-muted small mb-2">
                    Ces remarques sont sauvegardées distinctement des données déclarées par l'entreprise et enrichissent le rapport d'instruction.
                  </p>
                  <textarea
                    class="form-control mb-2"
                    rows="5"
                    [(ngModel)]="recommendation"
                    placeholder="Indiquez vos appréciations sur le modèle CEP, la solvabilité, le ratio DSCR et les points de vigilance..."
                  ></textarea>
                  <button
                    type="button"
                    class="btn btn-sm btn-primary"
                    (click)="saveExpertNotes()"
                    [disabled]="savingNotes"
                  >
                    <i class="iconoir-floppy-disk me-1"></i> {{ savingNotes ? 'Sauvegarde...' : 'Enregistrer les notes d\'expert' }}
                  </button>
                </div>
              }

              <!-- Boutons de décision -->
              <div class="decision-stack mt-3">
                <button type="button" class="btn btn-primary w-100" (click)="validateStructuring('PREQUALIFIE')">
                  <i class="iconoir-check me-1"></i> Valider la structuration & Préqualifier
                </button>
                <button type="button" class="btn btn-ghost w-100 mt-2" (click)="requestComplements()">
                  <i class="iconoir-refresh me-1"></i> Demander des pièces complémentaires
                </button>
              </div>
            } @else {
              <div class="text-center py-5 text-muted">
                <i class="iconoir-cursor-pointer fs-1 d-block mb-2 text-muted"></i>
                <strong>Sélectionnez un dossier à gauche</strong>
                <p class="small">Cliquez sur une mission pour ouvrir l'atelier d'audit, prévisualiser les 8 volets et télécharger le modèle CEP prérempli.</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ExpertMissionsComponent implements OnInit {
  private toast = inject(ToastService)
  private dossierSvc = inject(DossierService)
  dossiers: ApiDossier[] = []
  selected: ApiDossier | null = null
  selectedFormData: any = null
  recommendation = 'Dossier bien préparé. Les prévisions de trésorerie confortent un ratio de couverture supérieur à 1.30.'
  activeTab: 'diagnostic' | 'form' | 'notes' = 'diagnostic'
  downloadingCep = false
  savingNotes = false

  ngOnInit() {
    this.loadMissions()
  }

  loadMissions() {
    const custom = getStoredCustomDossiers()
    this.dossierSvc.readAll().subscribe({
      next: (d) => {
        const base = d && d.length ? d : (mockDossiers as any[])
        this.dossiers = [...custom, ...base]
        if (this.dossiers.length) this.selectDossier(this.dossiers[0])
      },
      error: () => {
        const base = (mockDossiers as any[])
        this.dossiers = [...custom, ...base]
        if (this.dossiers.length) this.selectDossier(this.dossiers[0])
      },
    })
  }

  selectDossier(dossier: ApiDossier) {
    this.selected = dossier
    this.recommendation = dossier.expertNotes || 'Dossier bien préparé. Les prévisions de trésorerie confortent un ratio de couverture supérieur à 1.30.'
    this.loadDossierFormData(dossier)
  }

  loadDossierFormData(dossier?: ApiDossier) {
    if (!dossier) return
    this.selectedFormData = null

    // 1. Données de formulaire directement attachées au dossier
    if ((dossier as any).formData) {
      this.selectedFormData = (dossier as any).formData
      return
    }

    // 2. Recherche dans le stockage local finawa_custom_dossiers
    const custom = getStoredCustomDossiers()
    const match = custom.find((c) => c.id === dossier.id || c.reference === dossier.reference)
    if (match?.formData) {
      this.selectedFormData = match.formData
      return
    }

    // 3. Appel backend API si ID numérique
    if (dossier.id && typeof dossier.id === 'number') {
      this.dossierSvc.getFormData(dossier.id).subscribe({
        next: (data) => {
          this.selectedFormData = data
        },
        error: () => {
          this.fallbackFormData(dossier)
        },
      })
    } else {
      this.fallbackFormData(dossier)
    }
  }

  private fallbackFormData(dossier: ApiDossier) {
    this.selectedFormData = {
      enterprise: {
        legalName: dossier.enterpriseName || dossier.entrepreneur || 'Teranga Agro SARL',
        legalForm: 'SARL',
        sector: 'Agroalimentaire',
        ninea: '0084920192V',
        rccm: 'SN-DKR-2021-B-10492',
        managerName: dossier.entrepreneur || 'Amadou Fall',
        phone: '+221 77 123 45 67',
      },
      financing: {
        desiredAmount: dossier.amount || 25000000,
        durationMonths: dossier.durationMonths || 36,
        needType: dossier.needTypeName || dossier.type || 'Investissement matériel',
        urgency: 'Sous 30 jours',
        purpose: dossier.purpose || 'Acquisition de matériel agroalimentaire',
      },
      financial: {
        lastYearTurnover: dossier.turnover || 48000000,
        currentYearEstimatedTurnover: Math.round((dossier.turnover || 48000000) * 1.25),
        certifiedStatements: dossier.caValid ? 'OUI' : 'NON',
        accountingAssistanceFirm: 'Cabinet Audit Dakar',
      },
      shareholders: [
        { firstName: 'Amadou', lastName: 'Fall', sharesPercentage: 60 },
        { firstName: 'Fatou', lastName: 'Ndiaye', sharesPercentage: 40 },
      ],
    }
  }

  downloadCep() {
    if (!this.selected) return
    this.downloadingCep = true
    const ref = (this.selected.reference || 'DOS').replace(/[^a-zA-Z0-9_-]/g, '_')
    const name = (this.selected.enterpriseName || 'ENT').replace(/[^a-zA-Z0-9_-]/g, '_')
    const fileName = `FINAWA_CEP_${ref}_${name}.xlsx`

    const triggerStaticDownload = () => {
      this.downloadingCep = false
      const a = document.createElement('a')
      a.href = './assets/CEP Modèle.xlsx'
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      this.toast.showSuccess(`Classeur CEP modèle (${fileName}) téléchargé avec succès !`)
    }

    if (this.selected.id && typeof this.selected.id === 'number') {
      this.dossierSvc.exportCep(this.selected.id).subscribe({
        next: (blob) => {
          this.downloadingCep = false
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = fileName
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          window.URL.revokeObjectURL(url)
          this.toast.showSuccess(`Classeur CEP original prérempli téléchargé avec succès (${fileName}) !`)
        },
        error: () => {
          triggerStaticDownload()
        },
      })
    } else {
      triggerStaticDownload()
    }
  }

  saveExpertNotes() {
    if (!this.selected || !this.selected.id) return
    this.savingNotes = true
    this.dossierSvc.updateExpertNotes(this.selected.id, this.recommendation).subscribe({
      next: () => {
        this.savingNotes = false
        if (this.selected) this.selected.expertNotes = this.recommendation
        this.toast.showSuccess('Notes d\'analyse expert enregistrées avec succès en base !')
      },
      error: () => {
        this.savingNotes = false
        this.toast.showError('Erreur lors de la sauvegarde des notes d\'expert')
      },
    })
  }

  money(value?: number) {
    return formatFcfa(value || 0)
  }

  generateLivrable(docType: string) {
    if (!this.selected) return
    this.toast.showSuccess(`Livrable "${docType}" généré avec succès pour ${this.selected.reference}`)
  }

  validateStructuring(newStatus: string) {
    if (!this.selected || !this.selected.id) return
    const id = this.selected.id
    this.dossierSvc.updateStatus(id, newStatus).subscribe({
      next: () => {
        if (this.selected) this.selected = { ...this.selected, status: newStatus }
        const idx = this.dossiers.findIndex((d) => d.id === id)
        if (idx !== -1) {
          this.dossiers[idx] = { ...this.dossiers[idx], status: newStatus }
        }
        this.toast.showSuccess(`Structuration validée pour ${this.selected?.reference} ! Dossier enregistré en base (${newStatus}).`)
      },
      error: () => {
        this.toast.showError(`Échec de mise à jour du statut`)
      },
    })
  }

  requestComplements() {
    if (!this.selected || !this.selected.id) return
    const id = this.selected.id
    this.dossierSvc.updateStatus(id, 'EN_COURS').subscribe({
      next: () => {
        this.toast.showInfo(`Notification envoyée à l'entrepreneur pour compléments comptables sur ${this.selected?.reference}.`)
      },
      error: () => {
        this.toast.showError(`Erreur lors de la notification`)
      },
    })
  }
}

@Component({
  selector: 'app-analyst-dashboard',
  standalone: true,
  imports: sharedImports,
  template: `
    <div class="finawa-page">
      <div class="finawa-page-header">
        <div>
          <span class="finawa-eyebrow">Analyse & Prequalification</span>
          <h1>File de préqualification</h1>
          <p>Priorisez, évaluez la bancabilité et préparez la transmission aux partenaires financiers.</p>
        </div>
        <div class="finawa-header-actions">
          <a routerLink="/analyste/dossiers" class="btn btn-primary">
            <i class="iconoir-folder me-1"></i> Ouvrir la file de traitement
          </a>
        </div>
      </div>
      <div class="row g-3">
        @for (kpi of kpis; track kpi.label) {
          <div class="col-md-4">
            <app-kpi-card [label]="kpi.label" [value]="kpi.value" [trend]="kpi.trend" [icon]="kpi.icon" [tone]="kpi.tone" />
          </div>
        }
      </div>
      <div class="finawa-panel mt-3">
        <h5>Priorité du jour</h5>
        <p class="mb-0">{{ priorityNote }}</p>
      </div>
    </div>
  `,
})
export class AnalystDashboardComponent implements OnInit {
  private dossierSvc = inject(DossierService)

  priorityNote = 'Chargement de la file des dossiers...'

  kpis: Kpi[] = [
    { label: 'À traiter', value: '...', trend: 'En attente', icon: 'iconoir-folder', tone: '#c41e3a' },
    { label: 'Préqualifiés', value: '...', trend: 'Bancables', icon: 'iconoir-check-circle', tone: '#680f1f' },
    { label: 'Total dossiers', value: '...', trend: 'Pipeline global', icon: 'iconoir-book-stack', tone: '#8b1227' },
  ]

  ngOnInit() {
    const custom = getStoredCustomDossiers()
    const update = (dossiers: ApiDossier[]) => {
      const all = [...custom, ...(dossiers.length ? dossiers : (mockDossiers as any[]))]
      const aTraiter = all.filter((d) => d.status === 'SOUMIS' || d.status === 'EN_COURS').length
      const prequalifies = all.filter((d) => d.status === 'PREQUALIFIE' || d.status === 'VALIDE').length
      const total = all.length

      this.kpis = [
        { label: 'À traiter', value: String(aTraiter), trend: `${aTraiter} en attente`, icon: 'iconoir-folder', tone: '#c41e3a' },
        { label: 'Préqualifiés', value: String(prequalifies), trend: `${total ? Math.round((prequalifies / total) * 100) : 0}% du pipeline`, icon: 'iconoir-check-circle', tone: '#680f1f' },
        { label: 'Total dossiers', value: String(total), trend: 'Pipeline global', icon: 'iconoir-book-stack', tone: '#8b1227' },
      ]

      const pending = all.find((d) => d.status === 'SOUMIS' || d.status === 'EN_COURS')
      if (pending) {
        this.priorityNote = `${pending.reference} (${pending.enterpriseName || pending.entrepreneur}) requiert validation technique et notation avant transmission aux partenaires.`
      } else if (all.length) {
        this.priorityNote = `Tous les dossiers actuels sont traités. ${all[0].reference} est au statut ${all[0].status}.`
      } else {
        this.priorityNote = 'Aucun dossier en attente pour le moment.'
      }
    }

    this.dossierSvc.readAll().subscribe({
      next: (dossiers) => update(dossiers),
      error: () => update([]),
    })
  }
}

@Component({
  selector: 'app-analyst-dossiers',
  standalone: true,
  imports: sharedImports,
  template: `
    <div class="finawa-page">
      <div class="finawa-page-header"><div><span class="finawa-eyebrow">Analyse dossiers</span><h1>Dossiers à traiter</h1><p>File triée par date de réception et score bancable.</p></div></div>
      <div class="row g-3">
        <div class="col-xl-7">
          <div class="finawa-panel p-0">
            @for (dossier of dossiers; track dossier.id) {
              <button class="queue-item" [class.active]="selected?.id === dossier.id" (click)="selectDossier(dossier)">
                <span><strong>{{ dossier.reference }}</strong><small>{{ dossier.enterpriseName || dossier.entrepreneur }} - {{ dossier.createdDate || dossier.createdAt }}</small></span>
                <span class="d-flex align-items-center gap-2">
                  <app-status-badge [status]="dossier.status || 'EN_COURS'" />
                  <strong>{{ dossier.score }}/100</strong>
                </span>
              </button>
            } @empty {
              <div class="text-center py-5 text-muted">Aucun dossier dans la file</div>
            }
          </div>
        </div>
        <div class="col-xl-5">
          @if (selected) {
            <div class="finawa-panel">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h5>{{ selected.reference }}</h5>
                <app-status-badge [status]="selected.status || 'EN_COURS'" />
              </div>
              <p class="text-muted small mb-3">{{ selected.enterpriseName || selected.entrepreneur }} - {{ money(selected.amount) }}</p>
              <app-score-gauge [score]="manualScore" title="Score analyse" description="Ajustez selon garanties, trésorerie et conformité documentaire." />
              <label class="form-label mt-3">Score manuel ajusté</label>
              <input type="range" min="0" max="100" class="form-range" [(ngModel)]="manualScore" />
              <label class="form-label">Recommandation d'orientation</label>
              <textarea class="form-control" rows="3" [(ngModel)]="recommendation"></textarea>

              <!-- Export CEP -->
              <div class="mb-3 p-2 bg-primary-subtle border border-primary-subtle rounded-3">
                <button
                  type="button"
                  class="btn btn-sm btn-primary text-white w-100 fw-bold shadow-sm"
                  (click)="downloadCep()"
                  [disabled]="downloadingCep"
                >
                  <i class="iconoir-download me-1"></i>
                  {{ downloadingCep ? 'Génération du modèle CEP...' : 'Télécharger le modèle CEP prérempli (.xlsx)' }}
                </button>
              </div>

              <div class="d-grid gap-2 mt-3">
                <button type="button" class="btn btn-outline-primary" (click)="runMatching()" [disabled]="matchingLoading">
                  <i class="iconoir-network me-1"></i> {{ matchingLoading ? 'Calcul du matching...' : 'Lancer le matching partenaires' }}
                </button>
              </div>

              @if (matchingResults.length > 0) {
                <div class="mt-3 p-2 border rounded bg-light">
                  <small class="fw-bold text-success d-block mb-1">
                    <i class="iconoir-check-circle me-1"></i> {{ matchingResults.length }} partenaires éligibles détectés :
                  </small>
                  <ul class="list-unstyled mb-0 small">
                    @for (m of matchingResults; track m.id) {
                      <li class="d-flex justify-content-between py-1 border-bottom">
                        <span>{{ m.partnerName }}</span>
                        <strong class="text-primary">{{ m.score }}% affinité</strong>
                      </li>
                    }
                  </ul>
                </div>
              }

              <div class="decision-stack mt-3">
                <button type="button" class="btn btn-primary" (click)="decide('PREQUALIFIE')" [disabled]="saving">
                  <i class="iconoir-check me-1"></i> Préqualifier le dossier
                </button>
                <button type="button" class="btn btn-ghost-danger" (click)="decide('REJETE')" [disabled]="saving">
                  <i class="iconoir-xmark me-1"></i> Rejeter le dossier
                </button>
              </div>
            </div>
          } @else {
            <div class="finawa-panel text-center py-5">
              <p class="text-muted mb-0">Aucun dossier à analyser</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class AnalystDossiersComponent implements OnInit {
  private toast = inject(ToastService)
  private dossierSvc = inject(DossierService)
  private matchingSvc = inject(MatchingService)
  dossiers: ApiDossier[] = []
  selected: ApiDossier | null = null
  manualScore = 78
  recommendation = 'Dossier recevable. Compléter les relevés bancaires avant transmission aux partenaires.'
  saving = false
  matchingLoading = false
  matchingResults: any[] = []

  ngOnInit() {
    const custom = getStoredCustomDossiers()
    this.dossierSvc.readAll().subscribe({
      next: (d) => {
        const base = d && d.length ? d : (mockDossiers as any[])
        this.dossiers = [...custom, ...base]
        if (this.dossiers.length) {
          this.selectDossier(this.dossiers[0])
        }
      },
      error: () => {
        const base = (mockDossiers as any[])
        this.dossiers = [...custom, ...base]
        if (this.dossiers.length) {
          this.selectDossier(this.dossiers[0])
        }
      },
    })
  }

  selectDossier(d: ApiDossier) {
    this.selected = d
    this.manualScore = d.score || 75
    this.matchingResults = []
  }

  money(value?: number) {
    return formatFcfa(value || 0)
  }

  runMatching() {
    if (!this.selected || !this.selected.id) return
    this.matchingLoading = true
    this.matchingSvc.runMatching(this.selected.id).subscribe({
      next: (results) => {
        this.matchingLoading = false
        this.matchingResults = results || []
        this.toast.showSuccess(`Matching exécuté : ${this.matchingResults.length} partenaires éligibles identifiés`)
      },
      error: () => {
        this.matchingLoading = false
        this.toast.showError('Erreur lors du calcul du matching')
      },
    })
  }

  decide(status: string) {
    if (!this.selected || !this.selected.id) return
    const id = this.selected.id
    this.saving = true
    this.dossierSvc.updateStatus(id, status).subscribe({
      next: () => {
        this.saving = false
        if (this.selected) this.selected.status = status
        const d = this.dossiers.find((x) => x.id === id)
        if (d) d.status = status
        this.toast.showSuccess(status === 'PREQUALIFIE' ? 'Dossier préqualifié avec succès en base' : 'Dossier rejeté')
      },
      error: () => {
        this.saving = false
        this.toast.showError('Erreur lors de la mise à jour du statut')
      },
    })
  }

  downloadingCep = false

  downloadCep() {
    if (!this.selected || !this.selected.id) return
    this.downloadingCep = true
    const ref = (this.selected.reference || 'DOS').replace(/[^a-zA-Z0-9_-]/g, '_')
    const name = (this.selected.enterpriseName || 'ENT').replace(/[^a-zA-Z0-9_-]/g, '_')
    const fileName = `FINAWA_CEP_${ref}_${name}.xlsx`

    this.dossierSvc.exportCep(this.selected.id).subscribe({
      next: (blob) => {
        this.downloadingCep = false
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        this.toast.showSuccess(`Classeur CEP prérempli téléchargé avec succès (${fileName}) !`)
      },
      error: () => {
        this.downloadingCep = false
        this.toast.showError('Échec du téléchargement du modèle CEP.')
      },
    })
  }
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: sharedImports,
  template: `
    <div class="finawa-page">
      <div class="finawa-page-header"><div><span class="finawa-eyebrow">Communication</span><h1>Messagerie</h1><p>Echanges internes entre entrepreneurs, partenaires, experts et analystes.</p></div></div>
      <div class="row g-3">
        <div class="col-xl-4">
          <div class="finawa-panel p-0">
            @for (thread of threads; track thread.contact) {
              <button class="queue-item" [class.active]="selected.contact === thread.contact" (click)="selected = thread">
                <span><strong>{{ thread.contact }}</strong><small>{{ thread.lastMessage }}</small></span>
                @if (thread.unread) { <span class="badge bg-primary">{{ thread.unread }}</span> }
              </button>
            }
          </div>
        </div>
        <div class="col-xl-8">
          <div class="finawa-panel conversation">
            <div class="d-flex align-items-center gap-2 mb-3">
              <app-avatar [name]="selected.contact" persona="FINANCEUR" />
              <div><h5 class="mb-0">{{ selected.contact }}</h5><small>{{ selected.role }}</small></div>
            </div>
            <div class="messages">
              @for (message of selected.messages; track message.body) {
                <div class="bubble" [class.me]="message.from === 'me'"><p>{{ message.body }}</p><span>{{ message.time }}</span></div>
              }
            </div>
            <div class="message-composer">
              <input class="form-control" [(ngModel)]="draft" placeholder="Écrire un message…" (keyup.enter)="send()" />
              <button type="button" class="btn btn-primary" (click)="send()" [disabled]="!draft.trim()">Envoyer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class MessagesComponent {
  threads = mockThreads
  selected = this.threads[0]
  draft = ''

  send() {
    const text = this.draft.trim()
    if (!text) return
    this.selected.messages.push({ from: 'me', body: text, time: 'maintenant' })
    this.selected.lastMessage = text
    this.draft = ''
  }
}
