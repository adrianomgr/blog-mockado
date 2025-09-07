import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () => import('./presentation/page/login/login.routes').then((m) => m.loginRoutes),
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
