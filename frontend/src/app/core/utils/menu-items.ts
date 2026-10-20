export interface MenuItemType {
  key: string
  label: string
  isTitle?: boolean
  icon?: string
  collapsed?: boolean
  url?: string
  parentKey?: string
  subMenu?: any
}

export const findAllParent = (
  menuItems: MenuItemType[],
  menuItem: any
): any => {
  let parents = []
  const parent = findMenuItem(menuItems, menuItem['parentKey'])

  if (parent) {
    parents.push(parent['key'])
    if (parent['parentKey'])
      parents = [...parents, ...findAllParent(menuItems, parent)]
  }
  return parents
}

export const findMenuItem = (
  menuItems: MenuItemType[],
  menuItemKey: string
): any => {
  if (menuItems && menuItemKey) {
    for (var i = 0; i < menuItems.length; i++) {
      if (menuItems[i].key === menuItemKey) {
        return menuItems[i]
      }
      var found = findMenuItem(menuItems[i].subMenu, menuItemKey)
      if (found) return found
    }
  }
  return null
}

export const MENU_ITEMS: MenuItemType[] = [
  {
    key: 'finawa',
    label: 'FINAWA',
    isTitle: true,
  },
  {
    key: 'dashboards',
    icon: 'iconoir-home-simple',
    label: 'Tableau de bord',
    url: '/admin/dashboard',
  },
  {
    key: 'dossiers',
    icon: 'iconoir-folder',
    label: 'Dossiers (Requêtes)',
    collapsed: true,
    subMenu: [
      {
        key: 'dossiers-list',
        label: 'Liste des dossiers',
        url: '/requests',
        parentKey: 'dossiers',
      },
      {
        key: 'dossiers-create',
        label: 'Nouvelle requête',
        url: '/requests/create',
        parentKey: 'dossiers',
      },
    ],
  },
  {
    key: 'entreprises',
    icon: 'iconoir-building',
    label: 'Entreprises',
    url: '/company',
  },
  {
    key: 'partenaires',
    icon: 'iconoir-network',
    label: 'Partenaires',
    url: '/partner',
  },
  {
    key: 'administration',
    icon: 'iconoir-settings',
    label: 'Administration',
    collapsed: true,
    subMenu: [
      {
        key: 'admin-users',
        label: 'Utilisateurs',
        url: '/admin/administration/users',
        parentKey: 'administration',
      },
      {
        key: 'admin-enterprises',
        label: 'Entreprises',
        url: '/admin/administration/enterprises',
        parentKey: 'administration',
      },
      {
        key: 'admin-profiles',
        label: 'Profils & Permissions',
        url: '/admin/administration/profiles',
        parentKey: 'administration',
      },
      {
        key: 'admin-documents',
        label: 'Documents',
        url: '/admin/administration/documents',
        parentKey: 'administration',
      },
    ],
  },
  {
    key: 'parametres',
    icon: 'iconoir-tools',
    label: 'Paramètres',
    collapsed: true,
    subMenu: [
      {
        key: 'param-labels',
        label: 'Labels',
        url: '/admin/parametres/labels',
        parentKey: 'parametres',
      },
      {
        key: 'param-alerts',
        label: 'Alertes',
        url: '/admin/parametres/alerts',
        parentKey: 'parametres',
      },
      {
        key: 'param-journals',
        label: 'Journal',
        url: '/admin/parametres/journals',
        parentKey: 'parametres',
      },
    ],
  },
]
