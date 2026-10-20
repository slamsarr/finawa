import { CommonModule } from '@angular/common'
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'
import { EMPTY, catchError, map, take } from 'rxjs'
import { dashboardPathForProfile } from '@core/data/finawa-platform.data'
import { selectUser } from '@stores/authentication/auth.selector'
import * as AuthActions from '@stores/authentication/auth.actions'
import { AuthHelperService } from '@utils/auth-helper.service'
import { ThemeService } from '@utils/theme.service'

type PublicPage = 'vision' | 'orientation' | 'ecosysteme' | 'fonctionnalites' | 'parcours' | 'offres' | 'faq' | 'roadmap'

@Component({
  selector: 'app-public-info',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './public-info.component.html',
  styleUrls: ['./public-info.component.scss'],
})
export class PublicInfoComponent implements OnInit, AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute)
  private store = inject(Store)
  private authHelper = inject(AuthHelperService)
  private host = inject(ElementRef<HTMLElement>)
  public themeService = inject(ThemeService)

  page: PublicPage = 'vision'
  mobileMenuOpen = false
  navScrolled = false
  resultPulse = false
  activeFaqCategory: 'all' | 'entrepreneurs' | 'financeurs' | 'general' = 'all'
  simulatorStage = 'pme'
  simulatorNeed = 'financement'
  simulatorAmount = 25000000
  simulatorBudget = 'avec_budget'
  private revealObserver?: IntersectionObserver
  private resultPulseTimer?: ReturnType<typeof setTimeout>

  user$ = this.store.select(selectUser)
  isLoggedIn$ = this.user$.pipe(map((user) => !!user))
  dashboardUrl$ = this.user$.pipe(map((user) => dashboardPathForProfile(user?.profile?.name)))

  navItems = [
    { label: 'Vision', path: '/vision' },
    { label: 'Orientation', path: '/orientation' },
    { label: 'Écosystème', path: '/ecosysteme' },
    { label: 'Fonctionnalités', path: '/fonctionnalites' },
    { label: 'Parcours', path: '/parcours' },
    { label: 'Offres', path: '/offres' },
    { label: 'FAQ', path: '/faq' },
  ]

  pageMeta: Record<PublicPage, { eyebrow: string; title: string; intro: string }> = {
    vision: {
      eyebrow: 'Pourquoi FINAWA',
      title: 'Unifier l’accès au financement, à la structuration et à l’accompagnement.',
      intro: 'FINAWA répond au problème central des entrepreneurs africains : les financeurs, experts et dispositifs d’appui existent, mais restent dispersés, difficiles à comparer et souvent mal connectés aux dossiers réels des entreprises.',
    },
    orientation: {
      eyebrow: 'Orientation intelligente',
      title: 'Identifier rapidement le bon parcours selon votre besoin.',
      intro: 'Le moteur FINAWA oriente les entrepreneurs selon les critères décrits dans le cahier des charges : chiffre d’affaires, ancienneté, secteur, montant recherché, budget et niveau de formalisation.',
    },
    ecosysteme: {
      eyebrow: 'Écosystème',
      title: 'Tous les acteurs clés réunis dans une architecture lisible.',
      intro: 'La plateforme connecte porteurs de projets, startups, TPE, PME, grandes entreprises, banques, SFD, fonds, bailleurs, assureurs, structures d’accompagnement et experts métiers.',
    },
    fonctionnalites: {
      eyebrow: 'Fonctionnalités',
      title: 'Des modules organisés autour du dossier entreprise.',
      intro: 'La plateforme n’est pas un simple annuaire : elle guide la préparation, la préqualification, le dépôt documentaire, le matching et le suivi opérationnel.',
    },
    parcours: {
      eyebrow: 'Parcours de financement',
      title: 'Un chemin clair en 8 étapes, de l’expression du besoin à la décision.',
      intro: 'FINAWA transforme une demande brute en dossier structuré, vérifié, puis transmis uniquement à deux ou trois partenaires pertinents.',
    },
    offres: {
      eyebrow: 'Modèle économique',
      title: 'Gratuit pour les entrepreneurs, structuré pour les partenaires.',
      intro: 'L’accès côté entrepreneurs reste gratuit pour favoriser l’inclusion financière. Les partenaires disposent de packs adaptés à leur niveau d’engagement.',
    },
    faq: {
      eyebrow: 'Questions fréquentes',
      title: 'Les réponses essentielles avant de créer votre dossier.',
      intro: 'Comprendre ce que FINAWA fait, pour qui, comment les données sont protégées et comment les dossiers sont orientés.',
    },
    roadmap: {
      eyebrow: 'Feuille de route',
      title: 'Une progression en phases, de la mise en relation à la marketplace panafricaine.',
      intro: 'Le projet évolue progressivement : mise en relation, intermédiation financière, IA avancée, expansion régionale puis marketplace continentale.',
    },
  }

  objectives = [
    { icon: 'fas fa-file-signature', title: 'Formaliser', desc: 'Accompagner les entreprises informelles vers RCCM, NINEA et conformité de base.' },
    { icon: 'fas fa-sitemap', title: 'Structurer', desc: 'Renforcer la comptabilité, les outils de pilotage, l’organisation et les systèmes internes.' },
    { icon: 'fas fa-hand-holding-usd', title: 'Financer', desc: 'Faciliter l’accès au crédit, à l’investissement, aux garanties et aux subventions.' },
    { icon: 'fas fa-user-shield', title: 'Accompagner', desc: 'Orienter vers les experts publics, privés et métiers adaptés au stade de l’entreprise.' },
    { icon: 'fas fa-network-wired', title: 'Digitaliser', desc: 'Dématérialiser les profils, documents, échanges, notifications et tableaux de bord.' },
  ]

  featureCards = [
    { title: 'Profil entreprise', icon: 'fas fa-id-card', desc: 'Identité, statut, secteur, région, effectifs, chiffre d’affaires et besoin principal.' },
    { title: 'Préqualification', icon: 'fas fa-clipboard-check', desc: 'Formulaires contextuels pour financement, accompagnement ou investissement.' },
    { title: 'Coffre-fort documentaire', icon: 'fas fa-folder-open', desc: 'RCCM, NINEA, états financiers, relevés bancaires, business plans et pièces d’identité.' },
    { title: 'Matching intelligent', icon: 'fas fa-route', desc: 'Orientation selon CA, ancienneté, secteur, montant recherché, budget et critères partenaires.' },
    { title: 'Espace partenaire', icon: 'fas fa-briefcase', desc: 'Page vitrine, catalogue de services, conditions, secteurs, zones et gestion des demandes.' },
    { title: 'Communication', icon: 'fas fa-comments', desc: 'Messagerie interne, notifications email, SMS, WhatsApp et suivi des statuts.' },
  ]

  actors = [
    { group: 'Entrepreneurs', items: ['Porteurs de projets', 'Startups', 'TPE', 'PME', 'Grandes entreprises'] },
    { group: 'Financement', items: ['Banques', 'SFD et microfinance', 'Fonds d’investissement', 'Fonds de garantie', 'Bailleurs', 'Assureurs'] },
    { group: 'Accompagnement', items: ['ADPME / ADEPME', 'DER/FJ', 'Chambres de commerce', 'Cabinets conseil', 'Experts comptables', 'Juristes et fiscalistes'] },
    { group: 'Gouvernance', items: ['Analystes', 'Administrateurs', 'Super administrateurs', 'Contrôle qualité', 'Supervision cybersécurité'] },
  ]

  steps = [
    ['01', 'Expression du besoin', 'Financement, investissement, formalisation ou accompagnement.'],
    ['02', 'Collecte des données', 'Informations entreprise, chiffres clés et pièces justificatives.'],
    ['03', 'Préqualification', 'Contrôle de complétude et vérification de cohérence.'],
    ['04', 'Score de financement', 'Diagnostic de bancabilité et de maturité financière.'],
    ['05', 'Génération de dossier', 'Business plan, prévisionnel et note de synthèse.'],
    ['06', 'Transmission ciblée', 'Envoi à deux ou trois partenaires pertinents.'],
    ['07', 'Suivi de traitement', 'Statuts, notifications et échanges centralisés.'],
    ['08', 'Décision partenaire', 'Réponse, garanties, conditions et suite du dossier.'],
  ]

  plans = [
    { name: 'Entrepreneurs', price: '0 FCFA', target: 'Porteurs de projets, startups, TPE, PME', features: ['Inscription', 'Profil complet', 'Préqualification', 'Matching', 'Documents'] },
    { name: 'Starter', price: 'Sur devis', target: 'Petits cabinets, SFD, experts indépendants', features: ['Page vitrine', 'Catalogue services', 'Demandes qualifiées', 'Messagerie'] },
    { name: 'Premium', price: 'Sur devis', target: 'Banques, fonds, réseaux d’experts', features: ['Visibilité renforcée', 'Dossiers scorés', 'Tableau de bord', 'Priorité matching'] },
    { name: 'Enterprise', price: 'Personnalisé', target: 'Institutions, bailleurs, programmes publics', features: ['Reporting', 'API', 'Sponsoring', 'Déploiement sur mesure'] },
  ]

  faqItems = [
    { category: 'entrepreneurs', question: 'FINAWA est-elle payante pour les entrepreneurs ?', answer: 'Non. L’inscription, le profil, la recherche, la préqualification et la mise en relation sont prévus comme gratuits pour les entrepreneurs.', open: true },
    { category: 'entrepreneurs', question: 'Et si mon entreprise n’est pas encore formalisée ?', answer: 'FINAWA oriente vers les dispositifs de formalisation et d’accompagnement adaptés avant la demande de financement.', open: false },
    { category: 'financeurs', question: 'Quel intérêt pour une banque ou un SFD ?', answer: 'Recevoir des dossiers mieux structurés, filtrés et alignés avec ses critères d’éligibilité.', open: false },
    { category: 'financeurs', question: 'Comment le matching fonctionne-t-il ?', answer: 'Il utilise notamment le chiffre d’affaires, l’ancienneté, le secteur, le montant recherché, le budget et le type de besoin.', open: false },
    { category: 'general', question: 'Quels documents sont gérés ?', answer: 'RCCM, NINEA, états financiers, relevés bancaires, business plans, contrats et pièces d’identité.', open: false },
    { category: 'general', question: 'Pourquoi transmettre à seulement 2 ou 3 partenaires ?', answer: 'Pour éviter la dispersion et maximiser la pertinence des dossiers envoyés aux acteurs les plus adaptés.', open: false },
  ] as Array<{ category: 'entrepreneurs' | 'financeurs' | 'general'; question: string; answer: string; open: boolean }>

  roadmap = [
    ['Phase 1', 'Plateforme de mise en relation', 'Profils, partenaires, documents, matching initial.'],
    ['Phase 2', 'Intermédiation financière', 'Parcours digital de financement et transmission ciblée.'],
    ['Phase 3', 'IA financière avancée', 'Diagnostic, scoring, rapports, business plans et maturité.'],
    ['Phase 4', 'Expansion Afrique de l’Ouest', 'Adaptation régionale et réseau d’acteurs élargi.'],
    ['Phase 5', 'Marketplace panafricaine', 'Écosystème financier continental interconnecté.'],
  ]

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.page = (data['page'] as PublicPage) || 'vision'
      window.scrollTo({ top: 0 })
      queueMicrotask(() => this.setupReveals())
    })

    this.user$.pipe(take(1)).subscribe((user) => {
      if (user) return
      this.authHelper.refresh().pipe(take(1), catchError(() => EMPTY)).subscribe((response) => {
        this.store.dispatch(AuthActions.refreshSuccess(response))
      })
    })
  }

  ngAfterViewInit(): void {
    this.setupReveals()
  }

  ngOnDestroy(): void {
    this.closeMobileMenu()
    this.revealObserver?.disconnect()
    if (this.resultPulseTimer) clearTimeout(this.resultPulseTimer)
  }

  get meta() {
    return this.pageMeta[this.page]
  }

  get filteredFaq() {
    return this.activeFaqCategory === 'all'
      ? this.faqItems
      : this.faqItems.filter((item) => item.category === this.activeFaqCategory)
  }

  get simulationResult() {
    if (this.simulatorNeed === 'formalisation' || (this.simulatorNeed === 'structuration' && this.simulatorBudget === 'zero')) {
      return { label: 'Accompagnement public et formalisation', partners: ['ADPME', 'DER/FJ', 'ADEPME', 'Chambres de commerce'], desc: 'Priorité aux dispositifs gratuits ou subventionnés pour établir les bases juridiques et organisationnelles.' }
    }
    if (this.simulatorNeed === 'investissement') {
      return { label: 'Fonds et investisseurs privés', partners: ['Business Angels', 'Fonds d’investissement', 'Capital-risque'], desc: 'Préparation du pitch, de la valorisation et du dossier de croissance.' }
    }
    if (this.simulatorAmount <= 10000000) {
      return { label: 'Microfinance et coopératives', partners: ['SFD', 'Coopératives', 'Microcrédit professionnel'], desc: 'Orientation vers les financeurs de proximité adaptés aux petits montants et aux jeunes entreprises.' }
    }
    if (this.simulatorAmount <= 75000000) {
      return { label: 'Banques PME et fonds de garantie', partners: ['Banques commerciales', 'Fonds de garantie', 'SFD grands comptes'], desc: 'Dossier structuré pour crédit professionnel, garantie et cofinancement.' }
    }
    return { label: 'Banques, fonds de dette et bailleurs', partners: ['Consortium bancaire', 'Fonds de dette', 'Bailleurs'], desc: 'Parcours adapté aux financements structurés et aux dossiers plus complexes.' }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme()
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : ''
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false
    document.body.style.overflow = ''
  }

  toggleFaq(item: { open: boolean }): void {
    item.open = !item.open
  }

  setSimulatorStage(stage: string): void {
    this.simulatorStage = stage
    this.pulseResult()
  }

  setSimulatorNeed(need: string): void {
    this.simulatorNeed = need
    this.pulseResult()
  }

  setSimulatorBudget(budget: string): void {
    this.simulatorBudget = budget
    this.pulseResult()
  }

  onAmountChange(): void {
    this.pulseResult()
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA'
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.navScrolled = window.scrollY > 40
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.mobileMenuOpen) this.closeMobileMenu()
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth >= 1200 && this.mobileMenuOpen) this.closeMobileMenu()
  }

  private pulseResult(): void {
    this.resultPulse = false
    if (this.resultPulseTimer) clearTimeout(this.resultPulseTimer)
    this.resultPulseTimer = setTimeout(() => {
      this.resultPulse = true
      this.resultPulseTimer = setTimeout(() => {
        this.resultPulse = false
      }, 450)
    }, 20)
  }

  private setupReveals(): void {
    if (typeof IntersectionObserver === 'undefined') return
    this.revealObserver?.disconnect()
    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          this.revealObserver?.unobserve(entry.target)
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
    )
    this.host.nativeElement.querySelectorAll('[data-reveal]').forEach((node: Element) => {
      this.revealObserver?.observe(node)
    })
  }
}
