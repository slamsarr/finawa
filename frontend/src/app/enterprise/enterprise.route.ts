import { Routes } from '@angular/router'
import { EnterpriseProfileComponent } from './profile/enterprise-profile.component'
import { EnterpriseDocumentsComponent } from './documents/enterprise-documents.component'

export const ENTERPRISE_ROUTES: Routes = [
  {
    path: 'profile',
    component: EnterpriseProfileComponent,
    data: { title: 'Profil Entreprise' },
  },
  {
    path: 'documents',
    component: EnterpriseDocumentsComponent,
    data: { title: 'Documents Entreprise' },
  },
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full',
  },
]
