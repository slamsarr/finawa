import { Route } from '@angular/router'
import { DashboardComponent } from './dashboard/dashboard.component'
import { ListUsersComponent } from './users/list-users.component'
import { ProfilesPermissionsComponent } from './profiles/profiles-permissions.component'
import { ListDocumentsComponent } from './documents/list-documents.component'
import { ListEnterprisesComponent } from './enterprises/list-enterprises.component'
import { ListLabelsComponent } from './labels/list-labels.component'
import { ListAlertsComponent } from './alerts/list-alerts.component'
import { ListJournalsComponent } from './journals/list-journals.component'

export const ADMIN_ROUTES: Route[] = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'administration',
    children: [
      {
        path: 'utilisateurs',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'users',
        component: ListUsersComponent,
        data: { title: 'Utilisateurs' },
      },
      {
        path: 'entreprises',
        redirectTo: 'enterprises',
        pathMatch: 'full',
      },
      {
        path: 'enterprises',
        component: ListEnterprisesComponent,
        data: { title: 'Entreprises' },
      },
      {
        path: 'profils-permissions',
        redirectTo: 'profiles',
        pathMatch: 'full',
      },
      {
        path: 'profiles',
        component: ProfilesPermissionsComponent,
        data: { title: 'Profils & Permissions' },
      },
      {
        path: 'documents',
        component: ListDocumentsComponent,
        data: { title: 'Documents' },
      },
    ]
  },
  {
    path: 'parametres',
    children: [
      {
        path: 'referentiels',
        redirectTo: 'labels',
        pathMatch: 'full',
      },
      {
        path: 'labels',
        component: ListLabelsComponent,
        data: { title: 'Labels' },
      },
      {
        path: 'alertes',
        redirectTo: 'alerts',
        pathMatch: 'full',
      },
      {
        path: 'alerts',
        component: ListAlertsComponent,
        data: { title: 'Alertes' },
      },
      {
        path: 'journal',
        redirectTo: 'journals',
        pathMatch: 'full',
      },
      {
        path: 'journals',
        component: ListJournalsComponent,
        data: { title: 'Journal des activités' },
      },
    ]
  },
]
