export const TabItems = [
  {
    tabName: 'Tout',
    tabContent: [
      {
        time: '5 min',
        iconClass: 'las la-user-plus',
        title: 'Nouveau client enregistré',
        description:
          'Amadou DIOP a été enregistré avec succès - Segment: Urbain Informel',
        type: 'success',
      },
      {
        time: '15 min',
        iconClass: 'las la-check-circle',
        title: 'Crédit approuvé',
        description:
          'Crédit agricole de 1 500 000 FCFA approuvé pour Fatou NDIAYE',
        type: 'success',
      },
      {
        time: '32 min',
        iconClass: 'las la-exclamation-triangle',
        title: 'Échéance à venir',
        description:
          '15 clients ont une échéance prévue demain - Montant total: 2 350 000 FCFA',
        type: 'warning',
      },
      {
        time: '1h',
        iconClass: 'las la-money-bill-wave',
        title: 'Remboursement reçu',
        description: 'Moussa SARR a effectué un remboursement de 250 000 FCFA',
        type: 'success',
      },
      {
        time: '2h',
        iconClass: 'las la-piggy-bank',
        title: "Dépôt d'épargne",
        description:
          'Dépôt de 125 000 FCFA sur le compte épargne de Aissatou FALL',
        type: 'info',
      },
      {
        time: '3h',
        iconClass: 'las la-calendar-check',
        title: 'Réunion comité de crédit',
        description: 'Réunion du comité prévue à 15h - 8 dossiers à examiner',
        type: 'info',
      },
      {
        time: '4h',
        iconClass: 'las la-file-alt',
        title: 'Rapport mensuel généré',
        description:
          'Le rapport de portefeuille pour Septembre 2024 est disponible',
        type: 'info',
      },
      {
        time: '5h',
        iconClass: 'las la-clock',
        title: 'Retard de paiement',
        description: "Ibrahima BA - Retard de 7 jours sur l'échéance du 25/09",
        type: 'danger',
      },
    ],
  },
  // {
  //   tabName: 'Crédits',
  //   tabContent: [
  //     {
  //       time: '15 min',
  //       iconClass: 'las la-check-circle',
  //       title: 'Crédit approuvé',
  //       description: 'Crédit agricole de 1 500 000 FCFA approuvé pour Fatou NDIAYE',
  //       type: 'success'
  //     },
  //     {
  //       time: '45 min',
  //       iconClass: 'las la-hand-holding-usd',
  //       title: 'Décaissement effectué',
  //       description: 'Crédit commerce de 800 000 FCFA décaissé - Mariama SY',
  //       type: 'success'
  //     },
  //     {
  //       time: '2h',
  //       iconClass: 'las la-file-invoice-dollar',
  //       title: 'Nouvelle demande de crédit',
  //       description: 'Ousmane GUEYE - Crédit transport 2 500 000 FCFA - En attente d\'analyse',
  //       type: 'info'
  //     },
  //     {
  //       time: '3h',
  //       iconClass: 'las la-times-circle',
  //       title: 'Demande rejetée',
  //       description: 'Crédit habitat de 5 000 000 FCFA rejeté - Capacité de remboursement insuffisante',
  //       type: 'danger'
  //     },
  //     {
  //       time: '4h',
  //       iconClass: 'las la-sync-alt',
  //       title: 'Restructuration approuvée',
  //       description: 'Restructuration du crédit de Khady SECK - Nouveau calendrier sur 18 mois',
  //       type: 'warning'
  //     },
  //     {
  //       time: '6h',
  //       iconClass: 'las la-calculator',
  //       title: 'Échéancier généré',
  //       description: 'Échéancier crédit élevage généré - Abdoulaye TRAORE (3 000 000 FCFA)',
  //       type: 'info'
  //     }
  //   ],
  // },
  // {
  //   tabName: 'Clients',
  //   tabContent: [
  //     {
  //       time: '5 min',
  //       iconClass: 'las la-user-plus',
  //       title: 'Nouveau client enregistré',
  //       description: 'Amadou DIOP - Segment: Urbain Informel - Agence Dakar',
  //       type: 'success'
  //     },
  //     {
  //       time: '1h',
  //       iconClass: 'las la-user-edit',
  //       title: 'Profil client mis à jour',
  //       description: 'Mise à jour des coordonnées de Fatou NDIAYE',
  //       type: 'info'
  //     },
  //     {
  //       time: '2h',
  //       iconClass: 'las la-id-card',
  //       title: 'KYC validé',
  //       description: 'Documents KYC validés pour Moussa SARR - Statut: Validé',
  //       type: 'success'
  //     },
  //     {
  //       time: '3h',
  //       iconClass: 'las la-exclamation-circle',
  //       title: 'KYC expiré',
  //       description: 'Documents KYC d\'Ibrahima BA ont expiré - Renouvellement nécessaire',
  //       type: 'warning'
  //     },
  //     {
  //       time: '5h',
  //       iconClass: 'las la-user-times',
  //       title: 'Client suspendu',
  //       description: 'Awa DIALLO suspendue - Retard supérieur à 90 jours',
  //       type: 'danger'
  //     },
  //     {
  //       time: '6h',
  //       iconClass: 'las la-birthday-cake',
  //       title: 'Anniversaire client',
  //       description: 'Anniversaire de Mamadou KANE - 2 ans de collaboration',
  //       type: 'info'
  //     }
  //   ],
  // },
  {
    tabName: 'Alertes',
    tabContent: [
      {
        time: '32 min',
        iconClass: 'las la-exclamation-triangle',
        title: 'Échéances à venir',
        description:
          '15 clients ont une échéance prévue demain - Total: 2 350 000 FCFA',
        type: 'warning',
      },
      {
        time: '5h',
        iconClass: 'las la-clock',
        title: 'Retards de paiement',
        description:
          '8 clients en retard de plus de 7 jours - Suivi recommandé',
        type: 'danger',
      },
      {
        time: '7h',
        iconClass: 'las la-chart-line',
        title: 'PAR 30 en hausse',
        description:
          "Le PAR 30 de l'agence Thiès est passé à 5.2% (+0.8 points)",
        type: 'danger',
      },
      {
        time: '8h',
        iconClass: 'las la-id-card',
        title: 'KYC à renouveler',
        description:
          '23 clients ont un KYC qui expire dans les 30 prochains jours',
        type: 'warning',
      },
      {
        time: '9h',
        iconClass: 'las la-wallet',
        title: 'Limite de caisse atteinte',
        description: "L'agence Kaolack a atteint 90% de sa limite de caisse",
        type: 'warning',
      },
      {
        time: '10h',
        iconClass: 'las la-shield-alt',
        title: 'Activité suspecte détectée',
        description:
          'Tentatives de connexion multiples sur le compte de Jean MENSAH',
        type: 'danger',
      },
      {
        time: '12h',
        iconClass: 'las la-database',
        title: 'Sauvegarde complétée',
        description: 'Sauvegarde automatique des données effectuée avec succès',
        type: 'success',
      },
    ],
  },
  // {
  //   tabName: 'Épargne',
  //   tabContent: [
  //     {
  //       time: '2h',
  //       iconClass: 'las la-piggy-bank',
  //       title: 'Dépôt d\'épargne',
  //       description: 'Aissatou FALL - Dépôt de 125 000 FCFA sur compte épargne ordinaire',
  //       type: 'success'
  //     },
  //     {
  //       time: '3h',
  //       iconClass: 'las la-hand-holding-usd',
  //       title: 'Retrait effectué',
  //       description: 'Ousmane GUEYE - Retrait de 50 000 FCFA du compte épargne projet',
  //       type: 'info'
  //     },
  //     {
  //       time: '5h',
  //       iconClass: 'las la-trophy',
  //       title: 'Objectif d\'épargne atteint',
  //       description: 'Mariama SY a atteint son objectif d\'épargne de 500 000 FCFA',
  //       type: 'success'
  //     },
  //     {
  //       time: '7h',
  //       iconClass: 'las la-calendar-alt',
  //       title: 'Échéance épargne à terme',
  //       description: 'Compte épargne à terme de Khady SECK arrive à échéance le 15/10',
  //       type: 'warning'
  //     },
  //     {
  //       time: '9h',
  //       iconClass: 'las la-plus-circle',
  //       title: 'Nouveau compte épargne',
  //       description: 'Ouverture compte épargne scolaire pour Abdoulaye TRAORE',
  //       type: 'success'
  //     },
  //     {
  //       time: '11h',
  //       iconClass: 'las la-percent',
  //       title: 'Intérêts crédités',
  //       description: 'Intérêts trimestriels crédités sur 156 comptes - Total: 2 850 000 FCFA',
  //       type: 'success'
  //     }
  //   ],
  // },
  {
    tabName: 'Système',
    tabContent: [
      {
        time: '4h',
        iconClass: 'las la-file-alt',
        title: 'Rapport mensuel généré',
        description: 'Rapport de portefeuille Septembre 2024 disponible',
        type: 'info',
      },
      {
        time: '6h',
        iconClass: 'las la-calendar-check',
        title: 'Réunion programmée',
        description:
          "Comité de crédit prévu demain à 15h - 8 dossiers à l'ordre du jour",
        type: 'info',
      },
      {
        time: '8h',
        iconClass: 'las la-sync',
        title: 'Synchronisation complétée',
        description:
          "Synchronisation des données avec l'agence de Ziguinchor réussie",
        type: 'success',
      },
      {
        time: '12h',
        iconClass: 'las la-database',
        title: 'Sauvegarde automatique',
        description: 'Sauvegarde quotidienne des données effectuée avec succès',
        type: 'success',
      },
      {
        time: '14h',
        iconClass: 'las la-user-shield',
        title: 'Nouvel utilisateur créé',
        description:
          'Compte créé pour Marie DIAGNE - Rôle: Agent de crédit - Agence Matam',
        type: 'info',
      },
      {
        time: '16h',
        iconClass: 'las la-bell',
        title: 'Maintenance programmée',
        description:
          'Maintenance système prévue ce dimanche de 2h à 6h du matin',
        type: 'warning',
      },
    ],
  },
]
