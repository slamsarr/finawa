import { Routes } from '@angular/router'
import { LayoutComponent } from '@layouts/layout/layout.component'
import { LandingComponent } from '@pages/landing/landing.component'
import { LoginComponent } from '@pages/login/login.component'
import { RegisterComponent } from '@pages/register/register.component'
import { Error404Component } from '@pages/error404/error404.component'
import { Error500Component } from '@pages/error500/error500.component'
import { MaintenanceComponent } from '@pages/maintenance/maintenance.component'
import { RecoverPwComponent } from '@pages/recover-pw/recover-pw.component'
import { VerifyEmailComponent } from '@pages/verify-email/verify-email.component'
import { authGuard } from '@core/common/guards/auth.guard'
import { profileGuard } from '@core/common/guards/profile.guard'
import { PublicInfoComponent } from '@pages/public-info/public-info.component'

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    pathMatch: 'full',
    data: { title: 'Accueil' },
  },
  { path: 'connexion', redirectTo: 'auth/log-in', pathMatch: 'full' },
  { path: 'inscription', redirectTo: 'auth/register', pathMatch: 'full' },
  { path: 'login', redirectTo: 'auth/log-in', pathMatch: 'full' },
  { path: 'register', redirectTo: 'auth/register', pathMatch: 'full' },
  {
    path: 'vision',
    component: PublicInfoComponent,
    data: { title: 'Vision', page: 'vision' },
  },
  {
    path: 'orientation',
    component: PublicInfoComponent,
    data: { title: 'Orientation', page: 'orientation' },
  },
  {
    path: 'ecosysteme',
    component: PublicInfoComponent,
    data: { title: 'Écosystème', page: 'ecosysteme' },
  },
  {
    path: 'fonctionnalites',
    component: PublicInfoComponent,
    data: { title: 'Fonctionnalités', page: 'fonctionnalites' },
  },
  {
    path: 'parcours',
    component: PublicInfoComponent,
    data: { title: 'Parcours', page: 'parcours' },
  },
  {
    path: 'offres',
    component: PublicInfoComponent,
    data: { title: 'Offres', page: 'offres' },
  },
  {
    path: 'faq',
    component: PublicInfoComponent,
    data: { title: 'FAQ', page: 'faq' },
  },
  {
    path: 'roadmap',
    component: PublicInfoComponent,
    data: { title: 'Roadmap', page: 'roadmap' },
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'admin',
        loadChildren: () =>
          import('../app/admin/admin.route').then((mod) => mod.ADMIN_ROUTES),
        canActivate: [profileGuard],
        data: { profile: 'ADMINISTRATION' }
      },
      {
        path: 'enterprise',
        loadChildren: () =>
          import('../app/enterprise/enterprise.route').then((mod) => mod.ENTERPRISE_ROUTES),
      },
      {
        path: 'espace',
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./features/finawa/workspace/finawa-workspace.component').then(
                (m) => m.EnterpriseDashboardComponent
              ),
            data: { title: 'Espace entreprise' },
          },
          {
            path: 'dossiers',
            loadComponent: () =>
              import('./features/finawa/workspace/finawa-workspace.component').then(
                (m) => m.DossiersComponent
              ),
            data: { title: 'Mes dossiers' },
          },
          {
            path: 'dossiers/nouveau',
            loadComponent: () =>
              import('./features/finawa/workspace/finawa-workspace.component').then(
                (m) => m.DossierWizardComponent
              ),
            data: { title: 'Nouveau dossier' },
          },
          {
            path: 'matching',
            loadComponent: () =>
              import('./features/finawa/workspace/finawa-workspace.component').then(
                (m) => m.MatchingComponent
              ),
            data: { title: 'Matching' },
          },
          {
            path: 'documents',
            loadComponent: () =>
              import('./features/finawa/workspace/finawa-workspace.component').then(
                (m) => m.FinawaDocumentsComponent
              ),
            data: { title: 'Documents' },
          },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
      },
      {
        path: 'partenaire',
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./features/finawa/workspace/finawa-workspace.component').then(
                (m) => m.PartnerDashboardComponent
              ),
            data: { title: 'Espace partenaire' },
          },
          {
            path: 'demandes',
            loadComponent: () =>
              import('./features/finawa/workspace/finawa-workspace.component').then(
                (m) => m.PartnerRequestsComponent
              ),
            data: { title: 'Demandes recues' },
          },
          {
            path: 'profil',
            loadComponent: () =>
              import('./features/finawa/workspace/finawa-workspace.component').then(
                (m) => m.PartnerProfileEditorComponent
              ),
            data: { title: 'Profil partenaire' },
          },
          {
            path: 'documents',
            loadComponent: () =>
              import('./features/finawa/workspace/finawa-workspace.component').then(
                (m) => m.FinawaDocumentsComponent
              ),
            data: { title: 'Documents partenaire' },
          },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
      },
      {
        path: 'expert',
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./features/finawa/workspace/finawa-workspace.component').then(
                (m) => m.ExpertDashboardComponent
              ),
            data: { title: 'Espace expert' },
          },
          {
            path: 'missions',
            loadComponent: () =>
              import('./features/finawa/workspace/finawa-workspace.component').then(
                (m) => m.ExpertMissionsComponent
              ),
            data: { title: 'Missions' },
          },
          {
            path: 'documents',
            loadComponent: () =>
              import('./features/finawa/workspace/finawa-workspace.component').then(
                (m) => m.FinawaDocumentsComponent
              ),
            data: { title: 'Pièces & Livrables' },
          },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
      },
      {
        path: 'analyste',
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./features/finawa/workspace/finawa-workspace.component').then(
                (m) => m.AnalystDashboardComponent
              ),
            data: { title: 'Analyse' },
          },
          {
            path: 'dossiers',
            loadComponent: () =>
              import('./features/finawa/workspace/finawa-workspace.component').then(
                (m) => m.AnalystDossiersComponent
              ),
            data: { title: 'Dossiers a traiter' },
          },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/finawa/profile/profile.component').then(
            (m) => m.FinawaProfileComponent
          ),
        data: { title: 'Mon profil' },
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./features/finawa/workspace/finawa-workspace.component').then(
            (m) => m.MessagesComponent
          ),
        data: { title: 'Messagerie' },
      },
    ],
    canActivate: [authGuard],
  },

  {
    path: 'partenaires/:id',
    loadComponent: () =>
      import('./features/finawa/public/partner-public.component').then(
        (m) => m.PartnerPublicComponent
      ),
    data: { title: 'Partenaire' },
  },

  {
    path: 'auth',
    children: [
      {
        path: 'log-in',
        component: LoginComponent,
        data: { title: 'Login' },
      },
      {
        path: 'register',
        component: RegisterComponent,
        data: { title: 'Register' },
      },
      {
        path: 'reset-pass',
        component: RecoverPwComponent,
        data: { title: 'Recover Password' },
      },
      {
        path: 'verify-email',
        component: VerifyEmailComponent,
        data: { title: 'Email Verification' },
      },
    ],
  },
  {
    path: 'not-found',
    component: Error404Component,
    data: { title: '404 - Error' },
  },
  {
    path: 'server-error',
    component: Error500Component,
    data: { title: '500 - Error' },
  },
  {
    path: 'maintenance',
    component: MaintenanceComponent,
    data: { title: 'Maintenance' },
  },
]
