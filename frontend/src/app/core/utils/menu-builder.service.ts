import { Injectable } from '@angular/core'
import { MenuItemType } from './menu-items'
import { Persona } from '@core/data/finawa-platform.data'

@Injectable({ providedIn: 'root' })
export class MenuBuilderService {
  build(persona: Persona): MenuItemType[] {
    if (persona === 'FINANCEUR' || persona === 'ACCOMPAGNATEUR') {
      return [
        { key: 'partner-title', label: 'ESPACE PARTENAIRE', isTitle: true },
        {
          key: 'partner-dashboard',
          icon: 'iconoir-home-simple',
          label: 'Tableau de bord',
          url: '/partenaire/dashboard',
        },
        {
          key: 'partner-requests',
          icon: 'iconoir-book-stack',
          label: 'Demandes recues',
          url: '/partenaire/demandes',
        },
        {
          key: 'partner-profile',
          icon: 'iconoir-profile-circle',
          label: 'Mon profil partenaire',
          url: '/partenaire/profil',
        },
        {
          key: 'partner-documents',
          icon: 'iconoir-page',
          label: 'Documents',
          url: '/partenaire/documents',
        },
        {
          key: 'partner-messages',
          icon: 'iconoir-chat-bubble',
          label: 'Messagerie',
          url: '/messages',
        },
      ]
    }

    if (persona === 'EXPERT') {
      return [
        { key: 'expert-title', label: 'ESPACE EXPERT', isTitle: true },
        {
          key: 'expert-dashboard',
          icon: 'iconoir-home-simple',
          label: 'Tableau de bord',
          url: '/expert/dashboard',
        },
        {
          key: 'expert-missions',
          icon: 'iconoir-task-list',
          label: 'Mes missions',
          url: '/expert/missions',
        },
        {
          key: 'expert-documents',
          icon: 'iconoir-page',
          label: 'Pièces & Livrables',
          url: '/expert/documents',
        },
        {
          key: 'expert-profile',
          icon: 'iconoir-profile-circle',
          label: 'Mon profil',
          url: '/profile',
        },
        {
          key: 'expert-messages',
          icon: 'iconoir-chat-bubble',
          label: 'Messagerie',
          url: '/messages',
        },
      ]
    }

    if (persona === 'ANALYSTE') {
      return [
        { key: 'analyst-title', label: 'ANALYSE', isTitle: true },
        {
          key: 'analyst-dashboard',
          icon: 'iconoir-home-simple',
          label: 'Tableau de bord',
          url: '/analyste/dashboard',
        },
        {
          key: 'analyst-dossiers',
          icon: 'iconoir-folder',
          label: 'Dossiers a traiter',
          url: '/analyste/dossiers',
        },
        {
          key: 'analyst-reports',
          icon: 'iconoir-stats-report',
          label: 'Rapports',
          url: '/analyste/dashboard',
        },
      ]
    }

    if (persona === 'ADMIN' || persona === 'SUPER_ADMIN') {
      return [
        { key: 'finawa', label: 'FINAWA', isTitle: true },
        {
          key: 'admin-dashboard',
          icon: 'iconoir-home-simple',
          label: 'Tableau de bord',
          url: '/admin/dashboard',
        },
        {
          key: 'admin-dossiers',
          icon: 'iconoir-folder',
          label: 'Dossiers',
          url: '/analyste/dossiers',
        },
        {
          key: 'admin-partners',
          icon: 'iconoir-network',
          label: 'Partenaires',
          url: '/partenaire/dashboard',
        },
        { key: 'administration', label: 'ADMINISTRATION', isTitle: true },
        {
          key: 'admin-users',
          icon: 'iconoir-community',
          label: 'Utilisateurs',
          url: '/admin/administration/users',
        },
        {
          key: 'admin-enterprises',
          icon: 'iconoir-building',
          label: 'Entreprises',
          url: '/admin/administration/enterprises',
        },
        {
          key: 'admin-profiles',
          icon: 'iconoir-lock',
          label: 'Profils & Permissions',
          url: '/admin/administration/profiles',
        },
        {
          key: 'admin-documents',
          icon: 'iconoir-page',
          label: 'Documents',
          url: '/admin/administration/documents',
        },
        { key: 'settings', label: 'PARAMETRES', isTitle: true },
        {
          key: 'admin-labels',
          icon: 'iconoir-label',
          label: 'Labels',
          url: '/admin/parametres/labels',
        },
        {
          key: 'admin-alerts',
          icon: 'iconoir-bell',
          label: 'Alertes',
          url: '/admin/parametres/alerts',
        },
        {
          key: 'admin-journals',
          icon: 'iconoir-list',
          label: 'Journal',
          url: '/admin/parametres/journals',
        },
      ]
    }

    return [
      { key: 'enterprise-title', label: 'FINAWA', isTitle: true },
      {
        key: 'enterprise-dashboard',
        icon: 'iconoir-home-simple',
        label: 'Tableau de bord',
        url: '/espace/dashboard',
      },
      {
        key: 'enterprise-dossiers',
        icon: 'iconoir-folder',
        label: 'Mes dossiers',
        collapsed: true,
        subMenu: [
          {
            key: 'espace-dossiers-list',
            label: 'En cours',
            url: '/espace/dossiers',
            parentKey: 'enterprise-dossiers',
          },
          {
            key: 'espace-dossiers-create',
            label: 'Nouvelle requete',
            url: '/espace/dossiers/nouveau',
            parentKey: 'enterprise-dossiers',
          },
        ],
      },
      {
        key: 'espace-matching',
        icon: 'iconoir-search',
        label: 'Matching',
        url: '/espace/matching',
      },
      {
        key: 'espace-documents',
        icon: 'iconoir-page',
        label: 'Mes documents',
        url: '/enterprise/documents',
      },
      {
        key: 'espace-profile',
        icon: 'iconoir-profile-circle',
        label: 'Mon entreprise',
        url: '/enterprise/profile',
      },
      {
        key: 'espace-alerts',
        icon: 'iconoir-bell',
        label: 'Mes alertes',
        url: '/espace/dashboard',
      },
      {
        key: 'espace-messages',
        icon: 'iconoir-chat-bubble',
        label: 'Messagerie',
        url: '/messages',
      },
      {
        key: 'espace-premium',
        icon: 'iconoir-star',
        label: 'Services premium',
        url: '/espace/matching',
      },
    ]
  }
}
