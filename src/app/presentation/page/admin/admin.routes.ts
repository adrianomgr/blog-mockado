import { Routes } from '@angular/router';
import { canDeactivateGuard } from '@app/infrastructure/guard';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./template/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard-view/dashboard-view.component').then((m) => m.DashboardViewComponent),
      },
      {
        path: 'posts',
        loadComponent: () =>
          import('./post-view/post-view.component').then((m) => m.PostViewComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./users-view/users-view.component').then((m) => m.UsersViewComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.component').then((m) => m.ProfileComponent),
        canDeactivate: [canDeactivateGuard],
      },
    ],
  },
];
