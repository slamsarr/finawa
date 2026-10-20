import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core'
import { RouterLink } from '@angular/router'
import { CommonModule } from '@angular/common'
import { Store } from '@ngrx/store'
import { selectUser } from '@stores/authentication/auth.selector'
import { take } from 'rxjs'

/* ─── Interfaces ─────────────────────────────────────────────────── */

export interface Pillar {
  icon: string
  title: string
  desc: string
}

export interface ProblemCard {
  icon: string
  title: string
  desc: string
  color: string
}

export interface Step {
  number: string
  title: string
  desc: string
  icon: string
}

export interface Solution {
  icon: string
  title: string
  subtitle: string
  features: string[]
  cta: string
  route: string
  highlight: boolean
}

export interface FaqItem {
  question: string
  answer: string
  open: boolean
}

export interface EcosystemNode {
  label: string
  icon: string
  x: number
  y: number
  color: string
}

/* ─── Component ──────────────────────────────────────────────────── */

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {
  /* nav state */
  navScrolled = false
  mobileMenuOpen = false

  /* hero rotating headline */
  rotatingWords = ['financement', 'croissance', 'avenir', 'réussite']
  currentWordIndex = 0
  private wordTimer?: ReturnType<typeof setInterval>

  /* FAQ accordion */
  activeFaqIndex: number | null = null

  /* services */
  private store = inject(Store)
  private host = inject(ElementRef<HTMLElement>)
  private revealObserver?: IntersectionObserver

  /* auth */
  isLoggedIn = false

  /* ── Pillars ─────────────────────────────────────────────────── */
  pillars: Pillar[] = [
    {
      icon: 'fi-rr-hand-holding-usd',
      title: 'Financement',
      desc: 'Accédez aux sources de financement adaptées à votre profil et à vos besoins.',
    },
    {
      icon: 'fi-rr-users',
      title: 'Accompagnement',
      desc: 'Bénéficiez de l\u2019expertise d\u2019analystes et d\u2019experts pour structurer votre dossier.',
    },
    {
      icon: 'fi-rr-network',
      title: 'Intermédiation',
      desc: 'Connectez-vous aux partenaires financiers qui correspondent à vos ambitions.',
    },
  ]

  /* ── Problems ───────────────────────────────────────────────── */
  problems: ProblemCard[] = [
    {
      icon: 'fi-rr-search',
      title: 'Vous cherchez un financement',
      desc: 'Vous avez un projet, une idée ou une entreprise à développer, mais vous ne savez pas vers quel interlocuteur vous tourner.',
      color: '#B91C1C',
    },
    {
      icon: 'fi-rr-document',
      title: 'Vous devez structurer votre dossier',
      desc: 'Vous avez besoin de présenter clairement votre projet, vos besoins financiers et les informations nécessaires à son étude.',
      color: '#8B1227',
    },
    {
      icon: 'fi-rr-handshake',
      title: 'Vous cherchez les bons partenaires',
      desc: 'Vous souhaitez identifier les acteurs financiers susceptibles d\u2019étudier votre projet selon leurs propres critères.',
      color: '#475569',
    },
  ]

  /* ── Steps ──────────────────────────────────────────────────── */
  steps: Step[] = [
    {
      number: '01',
      title: 'Présentez votre projet',
      desc: 'Créez votre compte, renseignez votre entreprise, votre activité et votre besoin de financement.',
      icon: 'fi-rr-user-add',
    },
    {
      number: '02',
      title: 'Structurez votre demande',
      desc: 'Complétez les informations nécessaires et préparez les éléments clés de votre dossier.',
      icon: 'fi-rr-edit',
    },
    {
      number: '03',
      title: 'Explorez les opportunités',
      desc: 'La plateforme facilite l\u2019identification des partenaires financiers susceptibles de correspondre à votre projet.',
      icon: 'fi-rr-chart-histogram',
    },
    {
      number: '04',
      title: 'Échangez avec vos interlocuteurs',
      desc: 'Suivez l\u2019avancement de votre dossier et poursuivez vos échanges directement sur la plateforme.',
      icon: 'fi-rr-comments',
    },
  ]

  /* ── Solutions ──────────────────────────────────────────────── */
  solutions: Solution[] = [
    {
      icon: 'fi-rr-briefcase',
      title: 'Entrepreneurs & PME',
      subtitle: 'Porteurs de projets et dirigeants',
      features: [
        'Présenter un projet et un besoin de financement',
        'Préparer et structurer une demande',
        'Découvrir des opportunités adaptées',
        'Suivre les démarches et les échanges',
      ],
      cta: 'Trouver un financement',
      route: '/auth/register',
      highlight: false,
    },
    {
      icon: 'fi-rr-bank',
      title: 'Banques & Institutions',
      subtitle: 'Partenaires financiers',
      features: [
        'Accéder à des dossiers structurés',
        'Faciliter les échanges avec les entreprises',
        'Identifier des projets selon vos critères',
      ],
      cta: 'Découvrir les solutions partenaires',
      route: '/auth/register',
      highlight: true,
    },
    {
      icon: 'fi-rr-graduation-cap',
      title: 'Analystes & Experts',
      subtitle: 'Consultants et cabinets spécialisés',
      features: [
        'Accompagner la structuration des dossiers',
        'Contribuer à l\u2019analyse financière',
        'Faciliter la préparation des projets',
      ],
      cta: 'Rejoindre l\u2019écosystème',
      route: '/auth/register',
      highlight: false,
    },
  ]

  /* ── FAQ ────────────────────────────────────────────────────── */
  faqItems: FaqItem[] = [
    {
      question: 'Qu\u2019est-ce que FINAWA\u00a0?',
      answer:
        'FINAWA est une plateforme numérique d\u2019intermédiation financière qui facilite la mise en relation entre les entrepreneurs, TPE, PME et startups africains et les acteurs du financement\u00a0: banques, institutions de microfinance, investisseurs et experts d\u2019accompagnement.',
      open: false,
    },
    {
      question: 'À qui s\u2019adresse la plateforme\u00a0?',
      answer:
        'FINAWA s\u2019adresse aux entrepreneurs, porteurs de projets, dirigeants de TPE/PME et startups qui recherchent un financement, ainsi qu\u2019aux institutions financières, banques, investisseurs et analystes qui souhaitent accéder à des dossiers structurés.',
      open: false,
    },
    {
      question: 'FINAWA accorde-t-elle directement des financements\u00a0?',
      answer:
        'Non. FINAWA est une plateforme d\u2019intermédiation. Elle ne distribue pas de crédit et ne garantit aucun financement. Son rôle est de faciliter la mise en relation entre les porteurs de projets et les partenaires financiers qui étudient les demandes selon leurs propres critères.',
      open: false,
    },
    {
      question: 'Quels documents dois-je préparer pour présenter mon projet\u00a0?',
      answer:
        'La plateforme vous guide dans la constitution de votre dossier. En général, vous aurez besoin de votre registre de commerce (RCCM), de votre identifiant fiscal (NINEA), de vos états financiers récents, d\u2019une présentation de votre projet et d\u2019une estimation de votre besoin de financement.',
      open: false,
    },
    {
      question: 'Comment les partenaires financiers étudient-ils les demandes\u00a0?',
      answer:
        'Chaque partenaire financier dispose de ses propres critères d\u2019instruction. FINAWA facilite la transmission des dossiers aux interlocuteurs les plus adaptés au profil de chaque demande, sans garantir de réponse favorable ni de délai de traitement.',
      open: false,
    },
    {
      question: 'Puis-je utiliser FINAWA pour rechercher un financement pour une startup\u00a0?',
      answer:
        'Oui. FINAWA est accessible aux startups, entrepreneurs individuels, TPE et PME. La plateforme vous aide à structurer votre demande et à identifier les acteurs du financement susceptibles d\u2019étudier votre projet, qu\u2019il s\u2019agisse de capital-risque, de microfinance ou de financement bancaire.',
      open: false,
    },
  ]

  /* ── Mock dashboard data (clearly fictitious) ───────────────── */
  mockSteps = [
    { label: 'Informations entreprise', done: true },
    { label: 'Documents requis', done: true },
    { label: 'Présentation du projet', done: true },
    { label: 'Validation du dossier', done: false },
    { label: 'Mise en relation partenaires', done: false },
  ]
  mockProgress = 60

  /* ─── Lifecycle ──────────────────────────────────────────────── */

  ngOnInit() {
    this.store
      .select(selectUser)
      .pipe(take(1))
      .subscribe((user) => {
        this.isLoggedIn = !!user
      })

    this.wordTimer = setInterval(() => {
      this.currentWordIndex = (this.currentWordIndex + 1) % this.rotatingWords.length
    }, 2800)
  }

  ngAfterViewInit() {
    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('fw-revealed')
            this.revealObserver?.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    this.host.nativeElement.querySelectorAll('.fw-reveal').forEach((el: Element) => {
      this.revealObserver?.observe(el)
    })
  }

  ngOnDestroy() {
    if (this.wordTimer) clearInterval(this.wordTimer)
    this.revealObserver?.disconnect()
  }

  /* ─── Scroll ─────────────────────────────────────────────────── */

  @HostListener('window:scroll')
  onScroll() {
    this.navScrolled = window.scrollY > 40
  }

  /* ─── FAQ ────────────────────────────────────────────────────── */

  toggleFaq(index: number) {
    this.activeFaqIndex = this.activeFaqIndex === index ? null : index
  }
}
