export type Persona =
  | 'ENTERPRISE'
  | 'FINANCEUR'
  | 'ACCOMPAGNATEUR'
  | 'EXPERT'
  | 'ANALYSTE'
  | 'ADMIN'
  | 'SUPER_ADMIN'

export type DossierStatus =
  | 'EN_COURS'
  | 'PREQUALIFIE'
  | 'TRANSMIS'
  | 'APPROUVE'
  | 'REJETE'
  | 'ARCHIVE'

export interface Kpi {
  label: string
  value: string
  trend: string
  icon: string
  tone: string
}

export interface FinancialBreakdown {
  financialSolidarity: number // /100
  legalCompliance: number // /100
  guarantees: number // /100
  governance: number // /100
  dscr?: number // Debt Service Coverage Ratio (ex: 1.35)
  debtRatio?: number // % endettement (ex: 38%)
  monthlyRepaymentEstimate?: number // FCFA
}

export interface Dossier {
  id: string | number
  reference: string
  entrepreneur: string
  type: 'Financement' | 'Accompagnement' | 'Investissement'
  financialInstrument?: 'Crédit Moyen Terme' | 'Facilité de Caisse / Découvert' | 'Microcrédit TPE' | 'Prise de participation' | 'Ligne de Garantie'
  amount: number
  score: number
  status: DossierStatus
  createdAt: string
  nextAction: string
  enterpriseId?: number
  needTypeId?: number
  durationMonths?: number
  purpose?: string
  description?: string
  caValid?: boolean
  nineaProvided?: boolean
  guaranteeComplete?: boolean
  turnover?: number
  netResult?: number
  breakdown?: FinancialBreakdown
}

export interface Partner {
  id: string | number
  name: string
  type: string
  category: 'BANQUE' | 'MICROFINANCE' | 'FONDS' | 'GARANTIE' | 'ACCOMPAGNEMENT'
  zones: string[]
  sectors: string[]
  score: number
  description: string
  conditions: string
  pricing: string
  processingDays: number
  approvalRate: number // ex 78%
  guaranteeRequired: string
  userId?: number
  minAmount?: number
  maxAmount?: number
  minDurationMonths?: number
  maxDurationMonths?: number
  interestRate?: number
  active?: boolean
}

export interface DocumentItem {
  id?: string | number
  name: string
  type: string
  category?: 'JURIDIQUE' | 'FISCAL' | 'COMPTABLE' | 'BANCAIRE' | 'OPERATIONNEL' | 'GARANTIE' | 'IDENTITE'
  size: string
  uploadedAt: string
  owner: string
  version?: string
  signed?: boolean
  archived?: boolean
  status?: 'VALIDE' | 'EN_REVUE' | 'A_RENOUVELER'
}

export interface AlertItem {
  title: string
  priority: 'HAUTE' | 'MOYENNE' | 'BASSE'
  time: string
  unread: boolean
}

export interface MessageThread {
  contact: string
  role: string
  unread: number
  lastMessage: string
  messages: Array<{ from: 'me' | 'them'; body: string; time: string }>
}

export const personaLabels: Record<Persona, string> = {
  ENTERPRISE: 'Entreprise',
  FINANCEUR: 'Financeur',
  ACCOMPAGNATEUR: 'Accompagnateur',
  EXPERT: 'Expert metier',
  ANALYSTE: 'Analyste',
  ADMIN: 'Administrateur',
  SUPER_ADMIN: 'Super admin',
}

export const personaColors: Record<Persona, string> = {
  ENTERPRISE: '#c41e3a',
  FINANCEUR: '#8b1226',
  ACCOMPAGNATEUR: '#a8283f',
  EXPERT: '#b31b34',
  ANALYSTE: '#6d0f21',
  ADMIN: '#dc2626',
  SUPER_ADMIN: '#4e0815',
}

export const dossierSteps = [
  'Expression du besoin',
  'Collecte des donnees',
  'Prequalification',
  'Score de financement',
  'Generation documents',
  'Transmission partenaires',
  'Suivi traitement',
  'Decision',
]

export const regions = [
  'Dakar',
  'Thies',
  'Saint-Louis',
  'Kaolack',
  'Ziguinchor',
  'Diourbel',
  'Fatick',
  'Kolda',
  'Louga',
  'Matam',
  'Tambacounda',
  'Kedougou',
  'Sedhiou',
  'Kaffrine',
  'Autre',
]

export const sectors = [
  'Agriculture',
  'Commerce',
  'Transformation agroalimentaire',
  'Services',
  'Digital',
  'BTP',
  'Energie',
  'Sante',
  'Education',
  'Industrie',
]

export const needs = [
  'Financement',
  'Accompagnement a la formalisation',
  'Accompagnement de projet',
  'Business Plan',
  'Organisation RH',
  'Systeme de pilotage et de controle',
  'Systeme d informations',
  'Investissement',
  'Structuration',
  'Digitalisation',
  'Formation',
]

export const mockDossiers: Dossier[] = [
  {
    id: 1,
    reference: 'FIN-2026-0001',
    entrepreneur: 'Teranga Agro SARL',
    type: 'Financement',
    financialInstrument: 'Crédit Moyen Terme',
    amount: 25000000,
    score: 78,
    status: 'EN_COURS',
    createdAt: '2026-08-02',
    nextAction: 'Compléter les états financiers 2025 et attestation fiscale',
    enterpriseId: 1,
    needTypeId: 1,
    durationMonths: 36,
    purpose: 'Acquisition d’une ligne de tri/calibrage agroalimentaire et BFR saisonnier.',
    caValid: true,
    nineaProvided: true,
    guaranteeComplete: false,
    turnover: 48000000,
    netResult: 5200000,
    breakdown: {
      financialSolidarity: 80,
      legalCompliance: 92,
      guarantees: 58,
      governance: 76,
      dscr: 1.38,
      debtRatio: 32,
      monthlyRepaymentEstimate: 795000,
    },
  },
  {
    id: 2,
    reference: 'FIN-2026-0002',
    entrepreneur: 'Nio Far Digital',
    type: 'Investissement',
    financialInstrument: 'Prise de participation',
    amount: 80000000,
    score: 84,
    status: 'PREQUALIFIE',
    createdAt: '2026-07-21',
    nextAction: 'Validation analyste avant transmission aux investisseurs',
    enterpriseId: 2,
    needTypeId: 2,
    durationMonths: 48,
    purpose: 'Expansion commerciale régionale, recrutement ingénieurs et fonds de roulement.',
    caValid: true,
    nineaProvided: true,
    guaranteeComplete: true,
    turnover: 110000000,
    netResult: 14500000,
    breakdown: {
      financialSolidarity: 88,
      legalCompliance: 95,
      guarantees: 72,
      governance: 86,
      dscr: 1.62,
      debtRatio: 18,
      monthlyRepaymentEstimate: 0,
    },
  },
  {
    id: 3,
    reference: 'FIN-2026-0003',
    entrepreneur: 'Baobab Textile',
    type: 'Accompagnement',
    financialInstrument: 'Microcrédit TPE',
    amount: 5000000,
    score: 64,
    status: 'TRANSMIS',
    createdAt: '2026-07-16',
    nextAction: 'Retour de l’institution de microfinance partenaire',
    enterpriseId: 3,
    needTypeId: 3,
    durationMonths: 18,
    purpose: 'Renforcement du fonds de roulement et mise en conformité comptable SYSCOHADA.',
    caValid: false,
    nineaProvided: true,
    guaranteeComplete: false,
    turnover: 12000000,
    netResult: 1800000,
    breakdown: {
      financialSolidarity: 60,
      legalCompliance: 75,
      guarantees: 45,
      governance: 62,
      dscr: 1.15,
      debtRatio: 44,
      monthlyRepaymentEstimate: 308000,
    },
  },
]

export const mockPartners: Partner[] = [
  {
    id: 1,
    name: 'Banque Atlas PME',
    type: 'Banque commerciale',
    category: 'BANQUE',
    zones: ['Dakar', 'Thies', 'Saint-Louis'],
    sectors: ['Commerce', 'Industrie', 'Services', 'Transformation agroalimentaire'],
    score: 92,
    description:
      'Ligne de crédit moyen terme et facilités de caisse pour PME formalisées ayant au moins 2 ans d’existence.',
    conditions: 'CA > 30 M FCFA, états financiers certifiés, nantissement ou caution solidaire.',
    pricing: 'Taux indicatif 8,5% à 10,5% · Frais d’instruction 1%.',
    processingDays: 14,
    approvalRate: 82,
    guaranteeRequired: 'Hypothèque ou garantie FONGIP (50%)',
    userId: 10,
    minAmount: 15000000,
    maxAmount: 500000000,
    minDurationMonths: 12,
    maxDurationMonths: 84,
    interestRate: 9.2,
    active: true,
  },
  {
    id: 2,
    name: 'IMF Sutura Microfinance',
    type: 'Système Financier Décentralisé (SFD)',
    category: 'MICROFINANCE',
    zones: ['Dakar', 'Kaolack', 'Fatick', 'Thies'],
    sectors: ['Agriculture', 'Commerce', 'Transformation agroalimentaire', 'Artisanat'],
    score: 86,
    description:
      'Solutions de microcrédit et lignes d’exploitation rapides adaptées aux TPE et groupements en développement.',
    conditions: 'Dossier allégé, historique de caisse régulier, visite d’activité sur site.',
    pricing: 'Taux dégressif 1,1% à 1,5% / mois · Sans frais cachés.',
    processingDays: 7,
    approvalRate: 89,
    guaranteeRequired: 'Caution solidaire ou gage sur équipement',
    userId: 11,
    minAmount: 500000,
    maxAmount: 15000000,
    minDurationMonths: 3,
    maxDurationMonths: 36,
    interestRate: 13.5,
    active: true,
  },
  {
    id: 3,
    name: 'Kora Impact Capital',
    type: 'Fonds d’investissement PME',
    category: 'FONDS',
    zones: ['Senegal', 'Cote d Ivoire', 'Benin'],
    sectors: ['Digital', 'Energie', 'Sante', 'Transformation agroalimentaire'],
    score: 81,
    description: 'Investissement en quasi-fonds propres et capital développement avec appui stratégique de gouvernance.',
    conditions: 'Modèle scalable, équipe dirigeante structurée, potentiel de croissance avéré.',
    pricing: 'Tickets 30 M à 400 M FCFA en fonds propres ou dette subordonnée.',
    processingDays: 30,
    approvalRate: 64,
    guaranteeRequired: 'Pacte d’actionnaires et gouvernance partagée',
    userId: 12,
    minAmount: 30000000,
    maxAmount: 400000000,
    minDurationMonths: 24,
    maxDurationMonths: 72,
    interestRate: 0,
    active: true,
  },
  {
    id: 4,
    name: 'Fonds National de Garantie (FONGIP)',
    type: 'Dispositif Public de Garantie',
    category: 'GARANTIE',
    zones: ['Senegal'],
    sectors: ['Agriculture', 'Industrie', 'Services', 'Digital', 'BTP'],
    score: 95,
    description: 'Couverture de garantie jusqu’à 70% auprès des banques pour réduire le risque perçu et faciliter l’accord.',
    conditions: 'Entreprise de droit sénégalais, dossier instruit par une institution financière agréée.',
    pricing: 'Commission d’intervention de 1% sur le montant garanti.',
    processingDays: 10,
    approvalRate: 91,
    guaranteeRequired: 'Contre-garantie sur l’outil de travail',
    userId: 13,
    minAmount: 5000000,
    maxAmount: 250000000,
    minDurationMonths: 12,
    maxDurationMonths: 84,
    interestRate: 0,
    active: true,
  },
  {
    id: 5,
    name: 'ADEPME (Agence de Développement PME)',
    type: 'Structure Publique d’Accompagnement',
    category: 'ACCOMPAGNEMENT',
    zones: ['Dakar', 'Thies', 'Saint-Louis', 'Kaolack', 'Ziguinchor'],
    sectors: ['Agriculture', 'Commerce', 'Transformation agroalimentaire', 'Services', 'Digital', 'Industrie'],
    score: 94,
    description: 'Accompagnement à la formalisation, mise à niveau, structuration organisationnelle et préparation des dossiers bancaires.',
    conditions: 'Entreprises en création, TPE et PME sénégalaises. Gratuit sous subvention de l’État.',
    pricing: 'Prise en charge publique (0 FCFA pour l’entrepreneur).',
    processingDays: 7,
    approvalRate: 95,
    guaranteeRequired: 'Sans garantie requise',
    userId: 14,
    minAmount: 0,
    maxAmount: 50000000,
    minDurationMonths: 1,
    maxDurationMonths: 24,
    interestRate: 0,
    active: true,
  },
  {
    id: 6,
    name: 'DER/FJ (Entreprenariat Rapide Femmes & Jeunes)',
    type: 'Fonds Public d’Amorçage & Autonomisation',
    category: 'ACCOMPAGNEMENT',
    zones: ['Senegal'],
    sectors: ['Agriculture', 'Commerce', 'Transformation agroalimentaire', 'Digital', 'Artisanat'],
    score: 93,
    description: 'Financement et accompagnement prioritaire des femmes entrepreneures et des jeunes porteurs de projets à taux préférentiel.',
    conditions: 'Jeunes (<35 ans) ou femmes promotrices, projet viable ou entreprise en formalisation.',
    pricing: 'Taux bonifié 5% / an ou subvention d’amorçage.',
    processingDays: 12,
    approvalRate: 90,
    guaranteeRequired: 'Caution solidaire de groupe ou sans garantie',
    userId: 15,
    minAmount: 500000,
    maxAmount: 25000000,
    minDurationMonths: 6,
    maxDurationMonths: 36,
    interestRate: 5.0,
    active: true,
  },
  {
    id: 7,
    name: 'Cabinet Synergie Conseil & Audit',
    type: 'Cabinet d’Expertise Comptable & Conseil',
    category: 'ACCOMPAGNEMENT',
    zones: ['Dakar', 'Thies'],
    sectors: ['Services', 'Transformation agroalimentaire', 'Commerce', 'Digital', 'BTP'],
    score: 88,
    description: 'Élaboration de Business Plans bancables, mise en place de systèmes de pilotage, assistance juridique et audit financier.',
    conditions: 'Entreprise avec budget d’accompagnement ou co-financement bailleurs.',
    pricing: 'Forfait structuration à partir de 350 000 FCFA.',
    processingDays: 10,
    approvalRate: 96,
    guaranteeRequired: 'Contrat de mission',
    userId: 16,
    minAmount: 0,
    maxAmount: 0,
    minDurationMonths: 1,
    maxDurationMonths: 12,
    interestRate: 0,
    active: true,
  },
  {
    id: 8,
    name: 'Teranga Business Angels Network',
    type: 'Réseau d’Investisseurs Privés',
    category: 'FONDS',
    zones: ['Senegal', 'Cote d Ivoire'],
    sectors: ['Digital', 'Transformation agroalimentaire', 'Sante', 'Services'],
    score: 85,
    description: 'Investissement d’amorçage (tickets 10M à 50M FCFA) et mentorat par des entrepreneurs chevronnés.',
    conditions: 'Startup ou PME innovante, traction commerciale validée, fort potentiel de scalabilité.',
    pricing: 'Prise de participation minoritaire (10% à 25%).',
    processingDays: 21,
    approvalRate: 70,
    guaranteeRequired: 'Pacte d’actionnaires',
    userId: 17,
    minAmount: 10000000,
    maxAmount: 60000000,
    minDurationMonths: 24,
    maxDurationMonths: 60,
    interestRate: 0,
    active: true,
  },
  {
    id: 9,
    name: 'Sonac Assurances & Cautions',
    type: 'Compagnie d’Assurance & Garanties de Marché',
    category: 'GARANTIE',
    zones: ['Senegal'],
    sectors: ['BTP', 'Commerce', 'Industrie', 'Services'],
    score: 89,
    description: 'Émission de cautions de soumission, garanties de bonne fin, retenues de garantie et assurances tous risques chantiers.',
    conditions: 'Marchés publics ou privés attribués, régularité fiscale et sociale.',
    pricing: 'Prime indicatif de 1% à 2% de la valeur cautionnée.',
    processingDays: 5,
    approvalRate: 92,
    guaranteeRequired: 'Ordre de service ou lettre de commande',
    userId: 18,
    minAmount: 2000000,
    maxAmount: 200000000,
    minDurationMonths: 3,
    maxDurationMonths: 24,
    interestRate: 0,
    active: true,
  },
]

export const mockDocuments: DocumentItem[] = [
  {
    id: 1,
    name: 'RCCM Teranga Agro.pdf',
    type: 'RCCM / Registre du commerce',
    category: 'JURIDIQUE',
    size: '1.2 Mo',
    uploadedAt: '2026-08-05',
    owner: 'Teranga Agro SARL',
    version: 'v1.1',
    signed: true,
    archived: false,
    status: 'VALIDE',
  },
  {
    id: 2,
    name: 'NINEA & Avis Immatriculation.pdf',
    type: 'NINEA & Avis d’immatriculation',
    category: 'FISCAL',
    size: '640 Ko',
    uploadedAt: '2026-08-05',
    owner: 'Teranga Agro SARL',
    version: 'v1.0',
    signed: true,
    archived: false,
    status: 'VALIDE',
  },
  {
    id: 3,
    name: 'Etats financiers SYSCOHADA 2024-2025.xlsx',
    type: 'États financiers certifiés',
    category: 'COMPTABLE',
    size: '860 Ko',
    uploadedAt: '2026-08-04',
    owner: 'Teranga Agro SARL',
    version: 'v2.0',
    signed: false,
    archived: false,
    status: 'VALIDE',
  },
  {
    id: 4,
    name: 'Relevés bancaires 6 derniers mois.pdf',
    type: 'Relevés bancaires',
    category: 'BANCAIRE',
    size: '3.4 Mo',
    uploadedAt: '2026-08-03',
    owner: 'Teranga Agro SARL',
    version: 'v1.0',
    signed: false,
    archived: false,
    status: 'EN_REVUE',
  },
  {
    id: 5,
    name: 'Business Plan & Prévisionnel FINAWA.pdf',
    type: 'Business plan & Prévisionnel',
    category: 'OPERATIONNEL',
    size: '2.8 Mo',
    uploadedAt: '2026-08-02',
    owner: 'Teranga Agro SARL',
    version: 'v1.2',
    signed: true,
    archived: false,
    status: 'VALIDE',
  },
  {
    id: 6,
    name: 'Attestation de garantie FONGIP 2026.pdf',
    type: 'Attestation de garantie',
    category: 'GARANTIE',
    size: '950 Ko',
    uploadedAt: '2026-07-29',
    owner: 'Teranga Agro SARL',
    version: 'v1.0',
    signed: true,
    archived: false,
    status: 'VALIDE',
  },
  {
    id: 7,
    name: 'CNI Dirigeant & Statuts notariés.pdf',
    type: 'Pièce d’identité & Statuts',
    category: 'IDENTITE',
    size: '1.9 Mo',
    uploadedAt: '2026-07-20',
    owner: 'Teranga Agro SARL',
    version: 'v1.0',
    signed: true,
    archived: false,
    status: 'VALIDE',
  },
]

export const mockAlerts: AlertItem[] = [
  {
    title: 'Pieces financieres requises pour FIN-2026-0001',
    priority: 'HAUTE',
    time: 'il y a 2h',
    unread: true,
  },
  {
    title: 'Nouveau partenaire compatible identifie',
    priority: 'MOYENNE',
    time: 'hier a 14:32',
    unread: true,
  },
  {
    title: 'Validation profil entreprise terminee',
    priority: 'BASSE',
    time: '08 aout 2026',
    unread: false,
  },
]

export const mockThreads: MessageThread[] = [
  {
    contact: 'Banque Atlas PME',
    role: 'Financeur',
    unread: 2,
    lastMessage: 'Nous avons besoin du releve bancaire du dernier trimestre.',
    messages: [
      {
        from: 'them',
        body: 'Votre dossier est interessant pour notre offre PME croissance.',
        time: '10:20',
      },
      {
        from: 'me',
        body: 'Merci, je peux transmettre les justificatifs cette semaine.',
        time: '10:32',
      },
      {
        from: 'them',
        body: 'Nous avons besoin du releve bancaire du dernier trimestre.',
        time: '11:05',
      },
    ],
  },
  {
    contact: 'Cabinet Horizon Conseil',
    role: 'Accompagnateur',
    unread: 0,
    lastMessage: 'La seance de cadrage est confirmee.',
    messages: [
      {
        from: 'them',
        body: 'La seance de cadrage est confirmee.',
        time: '09:14',
      },
    ],
  },
]

export function normalizePersona(profileName?: string): Persona {
  const value = (profileName || '').toUpperCase()
  if (value.includes('SUPER')) return 'SUPER_ADMIN'
  if (value.includes('ADMIN')) return 'ADMIN'
  if (value.includes('ANALYST')) return 'ANALYSTE'
  if (value.includes('ANALYSTE')) return 'ANALYSTE'
  if (value.includes('EXPERT')) return 'EXPERT'
  if (value.includes('FINANCE')) return 'FINANCEUR'
  if (value.includes('BANQUE')) return 'FINANCEUR'
  if (value.includes('ACCOMP')) return 'ACCOMPAGNATEUR'
  if (value.includes('PARTENAIRE')) return 'FINANCEUR'
  if (value.includes('ENTERPRISE')) return 'ENTERPRISE'
  if (value.includes('ENTREPRISE')) return 'ENTERPRISE'
  if (value.includes('ENTREPRENEUR')) return 'ENTERPRISE'
  return 'ENTERPRISE'
}

export function dashboardPathForProfile(profileName?: string): string {
  const persona = normalizePersona(profileName)
  if (persona === 'ADMIN' || persona === 'SUPER_ADMIN') {
    return '/admin/dashboard'
  }
  if (persona === 'FINANCEUR' || persona === 'ACCOMPAGNATEUR') {
    return '/partenaire/dashboard'
  }
  if (persona === 'EXPERT') {
    return '/expert/dashboard'
  }
  if (persona === 'ANALYSTE') {
    return '/analyste/dashboard'
  }
  return '/espace/dashboard'
}

export function formatFcfa(value: number): string {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)} Mds FCFA`
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)} M FCFA`
  if (value >= 1000) return `${(value / 1000).toFixed(0)} K FCFA`
  return `${value} FCFA`
}
