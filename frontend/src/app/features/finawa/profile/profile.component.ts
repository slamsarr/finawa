import { CommonModule } from '@angular/common'
import { Component, OnInit, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Store } from '@ngrx/store'
import { needs, normalizePersona, Persona, regions, sectors } from '@core/data/finawa-platform.data'
import { selectUser } from '@stores/authentication/auth.selector'
import {
  AvatarComponent,
  PersonaBadgeComponent,
} from '@core/common/components/finawa-ui.component'

@Component({
  selector: 'app-finawa-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, AvatarComponent, PersonaBadgeComponent],
  template: `
    <div class="finawa-page">
      <div class="finawa-page-header">
        <div>
          <span class="finawa-eyebrow">Compte</span>
          <h1>Mon profil {{ persona === 'EXPERT' ? 'Expert Métier' : '' }}</h1>
          <p>Informations personnelles, {{ persona === 'EXPERT' ? 'cabinet d’expertise, domaines d’intervention' : 'entreprise, besoins' }}, sécurité et permissions.</p>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-xl-3">
          <div class="finawa-panel profile-card sticky-lg-top">
            @if (persona === 'EXPERT') {
              <app-avatar [name]="expert.fullName" persona="EXPERT" [size]="92" />
              <h4 class="mt-3 mb-1">{{ expert.fullName }}</h4>
              <p class="text-muted small">{{ expert.title }} · {{ expert.cabinet }}</p>
              <app-persona-badge persona="EXPERT" />
              <hr />
              <div class="quick-stat"><span>Missions actives</span><strong>{{ expert.activeMissions }}</strong></div>
              <div class="quick-stat"><span>Livrables certifiés</span><strong>{{ expert.certifiedDeliverables }}</strong></div>
              <div class="quick-stat"><span>Évaluation</span><strong>{{ expert.rating }}</strong></div>
            } @else {
              <app-avatar name="Awa Ndiaye" persona="ENTERPRISE" [size]="92" />
              <h4 class="mt-3 mb-1">Awa Ndiaye</h4>
              <p class="text-muted">Fondatrice - Teranga Agro SARL</p>
              <app-persona-badge persona="ENTERPRISE" />
              <hr />
              <div class="quick-stat"><span>Dossiers</span><strong>3</strong></div>
              <div class="quick-stat"><span>Documents</span><strong>18</strong></div>
              <div class="quick-stat"><span>Score</span><strong>78/100</strong></div>
            }
          </div>
        </div>

        <div class="col-xl-9">
          <div class="finawa-panel">
            <div class="profile-tabs">
              @for (tab of currentTabs; track tab.key) {
                <button type="button" [class.active]="activeTab === tab.key" (click)="activeTab = tab.key">
                  <i [class]="tab.icon"></i> {{ tab.label }}
                </button>
              }
            </div>

            @if (activeTab === 'personal') {
              <h5>Informations personnelles</h5>
              <div class="row g-3">
                <div class="col-md-4"><label class="form-label">Nom</label><input class="form-control" [(ngModel)]="personal.lastName" /></div>
                <div class="col-md-4"><label class="form-label">Prénom</label><input class="form-control" [(ngModel)]="personal.firstName" /></div>
                <div class="col-md-4">
                  <label class="form-label">Genre</label>
                  <select class="form-select" [(ngModel)]="personal.genre">
                    <option value="Femme">Femme</option>
                    <option value="Homme">Homme</option>
                  </select>
                </div>
                <div class="col-md-6"><label class="form-label">Email</label><input class="form-control" [(ngModel)]="personal.email" readonly /></div>
                <div class="col-md-6"><label class="form-label">Téléphone</label><input class="form-control" [(ngModel)]="personal.phone" /></div>
                <div class="col-md-4"><label class="form-label">Région</label><select class="form-select" [(ngModel)]="personal.region">@for (region of regions; track region) { <option>{{ region }}</option> }</select></div>
                <div class="col-md-4"><label class="form-label">Pays</label><input class="form-control" [(ngModel)]="personal.country" /></div>
                <div class="col-md-4"><label class="form-label">Années d'expérience</label><input type="number" class="form-control" [(ngModel)]="personal.age" /></div>
              </div>
            }

            @if (activeTab === 'expert_cabinet' && persona === 'EXPERT') {
              <h5>Cabinet d'expertise & Habilitations</h5>
              <div class="row g-3">
                <div class="col-md-6"><label class="form-label">Raison sociale du cabinet</label><input class="form-control" [(ngModel)]="expert.cabinet" /></div>
                <div class="col-md-6"><label class="form-label">Numéro d'agrément / Ordre professionnel</label><input class="form-control" [(ngModel)]="expert.orderNumber" /></div>
                <div class="col-md-4"><label class="form-label">Titre professionnel</label><input class="form-control" [(ngModel)]="expert.title" /></div>
                <div class="col-md-4"><label class="form-label">Forme juridique</label><input class="form-control" [(ngModel)]="expert.legalForm" /></div>
                <div class="col-md-4"><label class="form-label">Tarif indicatif journalier (FCFA)</label><input type="number" class="form-control" [(ngModel)]="expert.dailyRate" /></div>
                <div class="col-12">
                  <label class="form-label">Présentation & Références</label>
                  <textarea class="form-control" rows="3" [(ngModel)]="expert.bio"></textarea>
                </div>
              </div>
            }

            @if (activeTab === 'expert_skills' && persona === 'EXPERT') {
              <h5>Domaines d'expertise & Compétences certifiées</h5>
              <div class="need-grid">
                @for (skill of expertSkills; track skill) {
                  <label [class.selected]="selectedSkills.includes(skill)">
                    <input type="checkbox" [checked]="selectedSkills.includes(skill)" (change)="toggleSkill(skill)" />
                    <span>{{ skill }}</span>
                  </label>
                }
              </div>
            }

            @if (activeTab === 'enterprise' && persona !== 'EXPERT') {
              <h5>Informations de l'entreprise</h5>
              <div class="row g-3">
                <div class="col-md-6"><label class="form-label">Nom de l'entreprise</label><input class="form-control" [(ngModel)]="enterprise.name" /></div>
                <div class="col-md-3"><label class="form-label">RCCM</label><input class="form-control" [(ngModel)]="enterprise.rccm" /></div>
                <div class="col-md-3"><label class="form-label">NINEA</label><input class="form-control" [(ngModel)]="enterprise.ninea" /></div>
                <div class="col-md-3"><label class="form-label">Date de création</label><input type="date" class="form-control" [(ngModel)]="enterprise.creationDate" /></div>
                <div class="col-md-3"><label class="form-label">Date démarrage activités</label><input type="date" class="form-control" [(ngModel)]="enterprise.startDate" /></div>
                <div class="col-md-3"><label class="form-label">Forme juridique</label><select class="form-select" [(ngModel)]="enterprise.legal"><option>SARL</option><option>SA</option><option>SAS</option><option>GIE</option><option>EI</option></select></div>
                <div class="col-md-3"><label class="form-label">Secteur d'activité</label><select class="form-select" [(ngModel)]="enterprise.sector">@for (sector of sectors; track sector) { <option>{{ sector }}</option> }</select></div>
                <div class="col-md-4"><label class="form-label">Sous-secteur</label><input class="form-control" [(ngModel)]="enterprise.subSector" placeholder="ex: Céréales locales, Aviculture..." /></div>
                <div class="col-md-4"><label class="form-label">Chiffre d'affaires dernière année (FCFA)</label><input type="number" class="form-control" [(ngModel)]="enterprise.revenue" /></div>
                <div class="col-md-2"><label class="form-label">Effectif permanent</label><input type="number" class="form-control" [(ngModel)]="enterprise.permanentEmployees" /></div>
                <div class="col-md-2"><label class="form-label">Effectif global</label><input type="number" class="form-control" [(ngModel)]="enterprise.globalEmployees" /></div>
              </div>
            }

            @if (activeTab === 'needs' && persona !== 'EXPERT') {
              <h5>Mes besoins</h5>
              <div class="need-grid">
                @for (need of needs; track need) {
                  <label [class.selected]="selectedNeeds.includes(need)">
                    <input type="checkbox" [checked]="selectedNeeds.includes(need)" (change)="toggleNeed(need)" />
                    <span>{{ need }}</span>
                  </label>
                }
              </div>
            }

            @if (activeTab === 'security') {
              <h5>Sécurité</h5>
              <div class="row g-3">
                <div class="col-md-4"><label class="form-label">Mot de passe actuel</label><input type="password" class="form-control" /></div>
                <div class="col-md-4"><label class="form-label">Nouveau mot de passe</label><input type="password" class="form-control" /></div>
                <div class="col-md-4"><label class="form-label">Confirmation</label><input type="password" class="form-control" /></div>
              </div>
              <div class="form-check form-switch mt-3">
                <input class="form-check-input" type="checkbox" id="mfaSwitch" />
                <label class="form-check-label" for="mfaSwitch">Activer MFA lors de la prochaine intégration backend</label>
              </div>
            }

            @if (activeTab === 'permissions') {
              <h5>Permissions</h5>
              <div class="accordion-list">
                @for (group of permissionGroups; track group.feature) {
                  <details open>
                    <summary>{{ group.feature }}</summary>
                    <div class="chip-list mt-2">
                      @for (permission of group.permissions; track permission) { <span>{{ permission }}</span> }
                    </div>
                  </details>
                }
              </div>
            }

            <button class="btn btn-primary mt-4" (click)="saved = true">Enregistrer</button>
            @if (saved) { <span class="text-primary fw-semibold ms-3">Modifications locales enregistrées</span> }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FinawaProfileComponent implements OnInit {
  private store = inject(Store)
  activeTab = 'personal'
  saved = false
  persona: Persona = 'ENTERPRISE'
  regions = regions
  sectors = sectors
  needs = needs
  selectedNeeds = ['Financement', 'Business Plan', 'Digitalisation']

  expert = {
    fullName: 'Mamadou Ba',
    title: 'Expert-Comptable & Auditeur Financier',
    cabinet: 'Cabinet Ba & Associés Conseil',
    orderNumber: 'ONECCA-SN-2018-042',
    legalForm: 'Société d’Exercice Libéral (SELARL)',
    dailyRate: 350000,
    activeMissions: 4,
    certifiedDeliverables: 18,
    rating: '4.9/5',
    bio: 'Accompagnement de plus de 80 PME dans l’élaboration de Business Plans bancables, la modélisation financière OHADA et la négociation de garanties FONGIP.',
  }

  expertSkills = [
    'États financiers SYSCOHADA',
    'Business Plan bancable',
    'Prévisions de trésorerie & BFR',
    'Calcul de couverture DSCR',
    'Structuration juridique (RCCM, NINEA)',
    'Garanties publiques (FONGIP, ADEPME)',
    'Levée de fonds & Capital-risque',
    'Audit & Due diligence',
  ]
  selectedSkills = [
    'États financiers SYSCOHADA',
    'Business Plan bancable',
    'Prévisions de trésorerie & BFR',
    'Calcul de couverture DSCR',
    'Garanties publiques (FONGIP, ADEPME)',
  ]

  personal = {
    firstName: 'Mamadou',
    lastName: 'Ba',
    genre: 'Homme',
    email: 'expert@finawa.com',
    phone: '+221 77 450 12 34',
    region: 'Dakar',
    country: 'Sénégal',
    age: 12,
  }

  enterprise = {
    name: 'Teranga Agro SARL',
    rccm: 'SN-DKR-2025-B-182',
    ninea: '009876543',
    creationDate: '2024-03-15',
    startDate: '2024-06-01',
    legal: 'SARL',
    sector: 'Transformation agroalimentaire',
    subSector: 'Céréales locales & conditionnement',
    revenue: 48000000,
    permanentEmployees: 12,
    globalEmployees: 28,
  }

  permissionGroups = [
    { feature: 'Dossiers', permissions: ['READ_DOSSIER', 'EDIT_DOSSIER'] },
    { feature: 'Documents & Livrables', permissions: ['ADD_DOCUMENT', 'READ_DOCUMENT', 'EDIT_DOCUMENT', 'READ_FILE_DOCUMENT'] },
    { feature: 'Messagerie', permissions: ['READ_MESSAGE', 'SEND_MESSAGE'] },
  ]

  get currentTabs() {
    if (this.persona === 'EXPERT') {
      return [
        { key: 'personal', label: 'Personnel', icon: 'iconoir-user' },
        { key: 'expert_cabinet', label: 'Cabinet & Agrément', icon: 'iconoir-building' },
        { key: 'expert_skills', label: 'Domaines d’expertise', icon: 'iconoir-spark' },
        { key: 'security', label: 'Sécurité', icon: 'iconoir-lock' },
        { key: 'permissions', label: 'Permissions', icon: 'iconoir-key' },
      ]
    }
    return [
      { key: 'personal', label: 'Personnel', icon: 'iconoir-user' },
      { key: 'enterprise', label: 'Entreprise', icon: 'iconoir-building' },
      { key: 'needs', label: 'Besoins', icon: 'iconoir-target' },
      { key: 'security', label: 'Sécurité', icon: 'iconoir-lock' },
      { key: 'permissions', label: 'Permissions', icon: 'iconoir-key' },
    ]
  }

  ngOnInit() {
    this.store.select(selectUser).subscribe((user) => {
      this.persona = normalizePersona(user?.profile?.name)
      if (this.persona === 'EXPERT') {
        this.personal.email = user?.login || 'expert@finawa.com'
        this.personal.firstName = 'Mamadou'
        this.personal.lastName = 'Ba'
      } else if (this.persona === 'ENTERPRISE') {
        this.personal.email = user?.login || 'entreprise@finawa.com'
        this.personal.firstName = 'Awa'
        this.personal.lastName = 'Ndiaye'
      }
    })
  }

  toggleNeed(need: string) {
    this.selectedNeeds = this.selectedNeeds.includes(need)
      ? this.selectedNeeds.filter((item) => item !== need)
      : [...this.selectedNeeds, need]
  }

  toggleSkill(skill: string) {
    this.selectedSkills = this.selectedSkills.includes(skill)
      ? this.selectedSkills.filter((item) => item !== skill)
      : [...this.selectedSkills, skill]
  }
}

